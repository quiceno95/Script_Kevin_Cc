#!/usr/bin/env node

/**
 * Script de Verificación de Entorno
 * Verifica que todos los requisitos estén instalados para ejecutar los tests de Selenium
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DE ENTORNO PARA SELENIUM AUTOMATION');
console.log('==================================================\n');

let allChecksPass = true;

// Función para ejecutar comandos y capturar salida
function runCommand(command, description) {
    try {
        const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
        console.log(`✅ ${description}: ${output.trim()}`);
        return true;
    } catch (error) {
        console.log(`❌ ${description}: NO ENCONTRADO`);
        return false;
    }
}

// Función para verificar archivos
function checkFile(filePath, description) {
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${description}: ENCONTRADO`);
        return true;
    } else {
        console.log(`❌ ${description}: NO ENCONTRADO`);
        return false;
    }
}

console.log('📋 VERIFICANDO REQUISITOS DEL SISTEMA:');
console.log('=====================================');

// 1. Verificar Node.js
if (!runCommand('node --version', 'Node.js')) {
    allChecksPass = false;
    console.log('   💡 Instalar desde: https://nodejs.org');
}

// 2. Verificar npm
if (!runCommand('npm --version', 'npm')) {
    allChecksPass = false;
}

// 3. Verificar Google Chrome
let chromeFound = false;
const chromeCommands = [
    'google-chrome --version',
    'chrome --version',
    'chromium --version',
    '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --version'
];

for (const cmd of chromeCommands) {
    if (runCommand(cmd, 'Google Chrome')) {
        chromeFound = true;
        break;
    }
}

if (!chromeFound) {
    allChecksPass = false;
    console.log('   💡 Instalar Chrome desde: https://www.google.com/chrome/');
}

console.log('\n📦 VERIFICANDO DEPENDENCIAS DEL PROYECTO:');
console.log('=========================================');

// 4. Verificar package.json
if (!checkFile('./package.json', 'package.json')) {
    allChecksPass = false;
    console.log('   💡 Asegúrate de estar en el directorio correcto del proyecto');
}

// 5. Verificar node_modules
if (!checkFile('./node_modules', 'node_modules')) {
    allChecksPass = false;
    console.log('   💡 Ejecutar: npm install');
} else {
    // Verificar selenium-side-runner
    if (!runCommand('npx selenium-side-runner --version', 'selenium-side-runner')) {
        allChecksPass = false;
        console.log('   💡 Ejecutar: npm install selenium-side-runner');
    }
    
    // Verificar chromedriver
    if (!runCommand('npx chromedriver --version', 'chromedriver')) {
        allChecksPass = false;
        console.log('   💡 Ejecutar: npm install chromedriver');
    }
}

console.log('\n📁 VERIFICANDO ARCHIVOS DEL PROYECTO:');
console.log('====================================');

// 6. Verificar archivos esenciales
const essentialFiles = [
    { path: './Tets Metdo De Pago.side', name: 'Archivo de test principal' },
    { path: './Tets Metdo De Pago.side.backup', name: 'Backup del test' },
    { path: './.side.yml', name: 'Configuración de Selenium' },
    { path: './test_data_expanded.json', name: 'Datos de usuarios' },
    { path: './prepare_data_only.js', name: 'Script de preparación' }
];

essentialFiles.forEach(file => {
    if (!checkFile(file.path, file.name)) {
        allChecksPass = false;
    }
});

console.log('\n🧪 VERIFICANDO FUNCIONALIDAD:');
console.log('============================');

// 7. Verificar que los scripts npm funcionan
try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const scripts = packageJson.scripts || {};
    
    const requiredScripts = ['test', 'show-expanded-data', 'prepare-next', 'show-current', 'restore'];
    
    requiredScripts.forEach(script => {
        if (scripts[script]) {
            console.log(`✅ Script npm '${script}': DISPONIBLE`);
        } else {
            console.log(`❌ Script npm '${script}': NO ENCONTRADO`);
            allChecksPass = false;
        }
    });
} catch (error) {
    console.log('❌ Error leyendo package.json');
    allChecksPass = false;
}

// 8. Verificar datos de prueba
try {
    const testData = JSON.parse(fs.readFileSync('./test_data_expanded.json', 'utf8'));
    if (testData.users && testData.users.length > 0) {
        console.log(`✅ Datos de prueba: ${testData.users.length} usuarios disponibles`);
    } else {
        console.log('❌ Datos de prueba: Formato inválido');
        allChecksPass = false;
    }
} catch (error) {
    console.log('❌ Error leyendo datos de prueba');
    allChecksPass = false;
}

console.log('\n' + '='.repeat(50));

if (allChecksPass) {
    console.log('🎉 ¡VERIFICACIÓN COMPLETADA EXITOSAMENTE!');
    console.log('✅ Todos los requisitos están instalados');
    console.log('🚀 El proyecto está listo para ejecutarse');
    console.log('\n📋 COMANDOS DISPONIBLES:');
    console.log('  npm run show-expanded-data  # Ver usuarios disponibles');
    console.log('  npm run prepare-next        # Preparar datos aleatorios');
    console.log('  npm run show-current        # Ver usuario actual');
    console.log('  npm test                    # Ejecutar test');
    console.log('  npm run restore             # Restaurar archivo original');
    process.exit(0);
} else {
    console.log('⚠️  VERIFICACIÓN INCOMPLETA');
    console.log('❌ Algunos requisitos no están instalados');
    console.log('💡 Revisa los mensajes de error arriba y sigue las instrucciones');
    console.log('\n📖 Para más ayuda, consulta el README.md');
    process.exit(1);
}
