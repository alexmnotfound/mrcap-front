const functions = require('firebase-functions');
const admin = require('firebase-admin');
const rateLimit = require('express-rate-limit');

admin.initializeApp();

// Rate limiting para intentos de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos por IP
  message: {
    error: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Función para validar intentos de login
exports.validateLoginAttempt = functions.https.onCall(async (data, context) => {
  const { email } = data;
  
  try {
    // Verificar si el usuario existe
    const userRecord = await admin.auth().getUserByEmail(email);
    
    // Registrar intento de login
    await admin.firestore().collection('login_attempts').add({
      email: email,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ip: context.rawRequest.ip,
      success: false
    });
    
    return { success: true, userExists: true };
  } catch (error) {
    // Registrar intento fallido
    await admin.firestore().collection('login_attempts').add({
      email: email,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ip: context.rawRequest.ip,
      success: false,
      error: error.message
    });
    
    return { success: false, userExists: false };
  }
});

// Función para limpiar intentos antiguos (ejecutar diariamente)
exports.cleanupLoginAttempts = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7); // Eliminar intentos de hace 7 días
  
  const snapshot = await admin.firestore()
    .collection('login_attempts')
    .where('timestamp', '<', cutoff)
    .get();
  
  const batch = admin.firestore().batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log(`Eliminados ${snapshot.size} intentos de login antiguos`);
});

// Función para obtener estadísticas de seguridad (solo admins)
exports.getSecurityStats = functions.https.onCall(async (data, context) => {
  // Verificar que el usuario sea admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }
  
  const userDoc = await admin.firestore()
    .collection('usuarios')
    .doc(context.auth.uid)
    .get();
  
  if (!userDoc.exists || userDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Acceso denegado');
  }
  
  // Obtener estadísticas de intentos de login
  const attemptsSnapshot = await admin.firestore()
    .collection('login_attempts')
    .orderBy('timestamp', 'desc')
    .limit(100)
    .get();
  
  const attempts = attemptsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  return {
    totalAttempts: attempts.length,
    recentAttempts: attempts.slice(0, 10),
    failedAttempts: attempts.filter(a => !a.success).length
  };
}); 