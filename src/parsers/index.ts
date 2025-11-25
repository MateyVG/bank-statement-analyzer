import { BankStatement } from '../types';
import { parseDSKXML } from './dskParser';
import { parseOBBTXT } from './obbParser';
import { parseOBBXML } from './obbXmlParser';

export function parseFile(content: string, fileName: string): BankStatement {
  // Detect file type
  const isXML = fileName.toLowerCase().endsWith('.xml') || content.trim().startsWith('<');
  
  if (isXML) {
    // Check if it's OBB XML or DSK XML
    // OBB XML has <STATEMENT> tag, DSK has <AccountMovementsResult>
    if (content.includes('<STATEMENT>') || content.includes('< S T A T E M E N T >')) {
      return parseOBBXML(content);
    } else {
      return parseDSKXML(content);
    }
  } else {
    return parseOBBTXT(content);
  }
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      
      if (!arrayBuffer) {
        reject(new Error('Failed to read file'));
        return;
      }
      
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Check for UTF-16 LE BOM (0xFF 0xFE)
      if (uint8Array.length >= 2 && uint8Array[0] === 0xFF && uint8Array[1] === 0xFE) {
        // UTF-16 LE encoding (OBB XML files)
        const decoder = new TextDecoder('utf-16le');
        const content = decoder.decode(arrayBuffer);
        resolve(content);
        return;
      }
      
      // Check if it's XML
      const firstBytes = String.fromCharCode(...uint8Array.slice(0, 5));
      const isXML = firstBytes.includes('<') || file.name.toLowerCase().endsWith('.xml');
      
      if (isXML) {
        // XML files are usually UTF-8
        const decoder = new TextDecoder('utf-8');
        const content = decoder.decode(arrayBuffer);
        resolve(content);
      } else {
        // TXT files from OBB are Windows-1251
        let decoded = '';
        
        for (let i = 0; i < uint8Array.length; i++) {
          const byte = uint8Array[i];
          
          if (byte < 128) {
            // ASCII range
            decoded += String.fromCharCode(byte);
          } else if (byte >= 0xC0 && byte <= 0xFF) {
            // Windows-1251 Cyrillic: А-Я, а-я (0xC0-0xFF -> U+0410-U+044F)
            decoded += String.fromCharCode(0x0410 + (byte - 0xC0));
          } else {
            // Special Windows-1251 characters (0x80-0xBF)
            const win1251ToUnicode: { [key: number]: number } = {
              0x80: 0x0402, 0x81: 0x0403, 0x82: 0x201A, 0x83: 0x0453,
              0x84: 0x201E, 0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021,
              0x88: 0x20AC, 0x89: 0x2030, 0x8A: 0x0409, 0x8B: 0x2039,
              0x8C: 0x040A, 0x8D: 0x040C, 0x8E: 0x040B, 0x8F: 0x040F,
              0x90: 0x0452, 0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201C,
              0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
              0x99: 0x2122, 0x9A: 0x0459, 0x9B: 0x203A, 0x9C: 0x045A,
              0x9D: 0x045C, 0x9E: 0x045B, 0x9F: 0x045F, 0xA0: 0x00A0,
              0xA1: 0x040E, 0xA2: 0x045E, 0xA3: 0x0408, 0xA4: 0x00A4,
              0xA5: 0x0490, 0xA6: 0x00A6, 0xA7: 0x00A7, 0xA8: 0x0401,
              0xA9: 0x00A9, 0xAA: 0x0404, 0xAB: 0x00AB, 0xAC: 0x00AC,
              0xAD: 0x00AD, 0xAE: 0x00AE, 0xAF: 0x0407, 0xB0: 0x00B0,
              0xB1: 0x00B1, 0xB2: 0x0406, 0xB3: 0x0456, 0xB4: 0x0491,
              0xB5: 0x00B5, 0xB6: 0x00B6, 0xB7: 0x00B7, 0xB8: 0x0451,
              0xB9: 0x2116, 0xBA: 0x0454, 0xBB: 0x00BB, 0xBC: 0x0458,
              0xBD: 0x0405, 0xBE: 0x0455, 0xBF: 0x0457
            };
            
            const unicode = win1251ToUnicode[byte];
            if (unicode) {
              decoded += String.fromCharCode(unicode);
            } else {
              decoded += String.fromCharCode(byte);
            }
          }
        }
        
        resolve(decoded);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // Read as ArrayBuffer to handle encoding manually
    reader.readAsArrayBuffer(file);
  });
}
