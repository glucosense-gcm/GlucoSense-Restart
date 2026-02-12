// Sibionics GS1 Protocol Parser

export interface GlucoseReading {
  timestamp: Date;
  glucoseMmol: number;
  glucoseMgdl: number;
  rawValue: number;
  isValid: boolean;
}

export const parseGlucosePacket = (base64: string): GlucoseReading | null => {
  try {
    const decoded = atob(base64);
    const bytes = Array.from(decoded).map(c => c.charCodeAt(0));
    
    // Validate header
    if (bytes.length < 10 || bytes[0] !== 0xAA || bytes[1] !== 0x55) {
      console.log('❌ Invalid packet header');
      return null;
    }
    
    const commandType = bytes[2];
    const recordCount = bytes[3];
    
    console.log('📦 Packet - Command:', commandType.toString(16), 'Records:', recordCount);
    console.log('📦 Hex:', bytes.slice(0, 20).map(b => b.toString(16).padStart(2, '0')).join(' '));
    
    // Parse glucose value from bytes[6-7] (Little Endian)
    const byte6 = bytes[6];
    const byte7 = bytes[7];
    const rawValue = (byte7 << 8) | byte6;
    
    // Convert to glucose values
    const glucoseMmol = rawValue / 1800.0;
    const glucoseMgdl = rawValue / 100.0;
    
    console.log('✅ GLUCOSE PARSED:');
    console.log('   Raw value:', rawValue);
    console.log('   🩸', glucoseMmol.toFixed(2), 'mmol/L');
    console.log('   🩸', glucoseMgdl.toFixed(1), 'mg/dL');
    
    // Validate range (normal: 3.0-15.0 mmol/L)
    const isValid = glucoseMmol >= 2.0 && glucoseMmol <= 25.0;
    
    if (!isValid) {
      console.log('⚠️ Value out of normal range!');
    }
    
    return {
      timestamp: new Date(),
      glucoseMmol: parseFloat(glucoseMmol.toFixed(2)),
      glucoseMgdl: parseFloat(glucoseMgdl.toFixed(1)),
      rawValue,
      isValid
    };
    
  } catch (error) {
    console.error('❌ Parse error:', error);
    return null;
  }
};

export const formatGlucose = (reading: GlucoseReading, unit: 'mmol' | 'mgdl' = 'mmol'): string => {
  if (unit === 'mmol') {
    return `${reading.glucoseMmol.toFixed(1)} mmol/L`;
  } else {
    return `${reading.glucoseMgdl.toFixed(0)} mg/dL`;
  }
};