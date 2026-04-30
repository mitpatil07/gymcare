/**
 * GymCare Health Monitoring Logic
 */

export const calculateThresholds = (age) => {
  const maxHR = 220 - age;
  return {
    maxHR,
    warningHR: Math.floor(maxHR * 0.85),
    dangerHR: Math.floor(maxHR * 0.95),
  };
};

export const detectRiskLevel = (hr, spo2, thresholds) => {
  if (hr >= thresholds.maxHR || spo2 < 90) {
    return {
      level: 'HIGH',
      color: '#FF0000',
      action: 'EMERGENCY: Seek help immediately!',
    };
  }
  
  if (hr >= thresholds.warningHR || spo2 < 94) {
    return {
      level: 'MEDIUM',
      color: '#FFA500',
      action: 'WARNING: Slow down and hydrate.',
    };
  }

  return {
    level: 'NORMAL',
    color: '#00FF00',
    action: 'Condition normal. Keep training!',
  };
};
