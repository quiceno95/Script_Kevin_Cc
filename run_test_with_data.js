#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script para ejecutar tests de Selenium con datos dinámicos
 * Lee datos de test_data.json y ejecuta el test con diferentes usuarios
 */

class TestRunner {
    constructor() {
        this.dataFile = path.join(__dirname, 'test_data.json');
        this.sideFile = path.join(__dirname, 'Tets Metdo De Pago.side');
        this.originalSideContent = null;
        this.testData = null;
        this.usedIndices = new Set();
    }

    loadTestData() {
        try {
            const data = fs.readFileSync(this.dataFile, 'utf8');
            this.testData = JSON.parse(data);
            console.log(`📊 Cargados ${this.testData.users.length} usuarios de prueba`);
        } catch (error) {
            console.error('❌ Error al cargar datos de prueba:', error.message);
            process.exit(1);
        }
    }

    loadOriginalSideFile() {
        try {
            this.originalSideContent = fs.readFileSync(this.sideFile, 'utf8');
            console.log('📁 Archivo .side original cargado');
        } catch (error) {
            console.error('❌ Error al cargar archivo .side:', error.message);
            process.exit(1);
        }
    }

    getNextUserData() {
        const availableIndices = [];
        for (let i = 0; i < this.testData.users.length; i++) {
            if (!this.usedIndices.has(i)) {
                availableIndices.push(i);
            }
        }

        if (availableIndices.length === 0) {
            console.log('🔄 Todos los usuarios han sido usados, reiniciando...');
            this.usedIndices.clear();
            return this.testData.users[0];
        }

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        this.usedIndices.add(randomIndex);
        return this.testData.users[randomIndex];
    }

    updateSideFileWithUserData(userData) {
        let updatedContent = this.originalSideContent;

        // Reemplazar valores en el archivo .side (usando valores actuales del archivo)
        const replacements = [
            // Nombre
            { 
                search: '"value": "Yair Rogher"', 
                replace: `"value": "${userData.firstName}"` 
            },
            // Apellido
            { 
                search: '"value": "Frank Flander"', 
                replace: `"value": "${userData.lastName}"` 
            },
            // Dirección
            { 
                search: '"value": "7898 - Holl Street AV Hilt"', 
                replace: `"value": "${userData.address}"` 
            },
            // Ciudad
            { 
                search: '"value": "New Brunswick"', 
                replace: `"value": "${userData.city}"` 
            },
            // Código postal
            { 
                search: '"value": "08901"', 
                replace: `"value": "${userData.zipCode}"` 
            },
            // Teléfono
            { 
                search: '"value": "867-348-2378"', 
                replace: `"value": "${userData.phone}"` 
            },
            // Email (aparece dos veces en el archivo)
            { 
                search: '"value": "Brandrfg78@gmail.com"', 
                replace: `"value": "${userData.email}"`,
                global: true
            }
        ];

        replacements.forEach(({ search, replace, global }) => {
            if (global) {
                // Reemplazar todas las ocurrencias
                updatedContent = updatedContent.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
            } else {
                // Reemplazar solo la primera ocurrencia
                updatedContent = updatedContent.replace(search, replace);
            }
        });

        // También actualizar el estado si es necesario
        if (userData.state) {
            // Buscar y reemplazar la selección del estado
            const statePattern = /"target": "value=New Jersey"/g;
            updatedContent = updatedContent.replace(statePattern, `"target": "value=${userData.state}"`);
        }

        // Actualizar educación
        if (userData.education) {
            const educationPattern = /"target": "value=Graduate"/g;
            updatedContent = updatedContent.replace(educationPattern, `"target": "value=${userData.education}"`);
        }

        try {
            fs.writeFileSync(this.sideFile, updatedContent);
            console.log(`✅ Archivo .side actualizado con datos de: ${userData.firstName} ${userData.lastName}`);
        } catch (error) {
            console.error('❌ Error al actualizar archivo .side:', error.message);
            throw error;
        }
    }

    restoreOriginalSideFile() {
        try {
            fs.writeFileSync(this.sideFile, this.originalSideContent);
            console.log('🔄 Archivo .side original restaurado');
        } catch (error) {
            console.error('⚠️  Error al restaurar archivo .side original:', error.message);
        }
    }

    runTest() {
        try {
            console.log('🚀 Ejecutando test...');
            const result = execSync('npm test', { 
                cwd: __dirname, 
                stdio: 'pipe',
                encoding: 'utf8',
                timeout: 120000 // 2 minutos timeout
            });
            
            console.log('✅ Test completado exitosamente');
            return true;
        } catch (error) {
            console.log('❌ Test falló:');
            console.log(error.stdout || error.message);
            return false;
        }
    }

    async runSingleTest(userIndex = null) {
        console.log('\n' + '='.repeat(60));
        console.log('🧪 INICIANDO EJECUCIÓN DE TEST');
        console.log('='.repeat(60));

        try {
            this.loadTestData();
            this.loadOriginalSideFile();

            let userData;
            if (userIndex !== null && userIndex < this.testData.users.length) {
                userData = this.testData.users[userIndex];
                console.log(`👤 Usando usuario específico #${userIndex}: ${userData.firstName} ${userData.lastName}`);
            } else {
                userData = this.getNextUserData();
                console.log(`👤 Usuario seleccionado: ${userData.firstName} ${userData.lastName}`);
            }

            console.log(`📧 Email: ${userData.email}`);
            console.log(`📱 Teléfono: ${userData.phone}`);

            this.updateSideFileWithUserData(userData);
            
            const success = this.runTest();
            
            console.log('\n' + '='.repeat(60));
            if (success) {
                console.log('🎉 TEST COMPLETADO EXITOSAMENTE');
            } else {
                console.log('💥 TEST FALLÓ');
            }
            console.log('='.repeat(60));

            return success;

        } catch (error) {
            console.error('❌ Error crítico:', error.message);
            return false;
        } finally {
            this.restoreOriginalSideFile();
        }
    }

    async runMultipleTests(count = 3) {
        console.log(`\n🔄 EJECUTANDO ${count} TESTS CON DATOS DIFERENTES`);
        console.log('='.repeat(60));

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < count; i++) {
            console.log(`\n📋 TEST ${i + 1} de ${count}`);
            const success = await this.runSingleTest();
            
            if (success) {
                successCount++;
            } else {
                failCount++;
            }

            // Pausa entre tests
            if (i < count - 1) {
                console.log('⏳ Esperando 5 segundos antes del siguiente test...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMEN FINAL');
        console.log('='.repeat(60));
        console.log(`✅ Tests exitosos: ${successCount}`);
        console.log(`❌ Tests fallidos: ${failCount}`);
        console.log(`📈 Tasa de éxito: ${((successCount / count) * 100).toFixed(1)}%`);
    }
}

// Función principal
async function main() {
    const args = process.argv.slice(2);
    const runner = new TestRunner();

    if (args.length === 0) {
        // Ejecutar un test con usuario aleatorio
        await runner.runSingleTest();
    } else if (args[0] === 'multiple') {
        // Ejecutar múltiples tests
        const count = parseInt(args[1]) || 3;
        await runner.runMultipleTests(count);
    } else if (args[0] === 'user') {
        // Ejecutar con usuario específico
        const userIndex = parseInt(args[1]);
        if (isNaN(userIndex)) {
            console.error('❌ Índice de usuario inválido');
            process.exit(1);
        }
        await runner.runSingleTest(userIndex);
    } else {
        console.log('📖 Uso:');
        console.log('  node run_test_with_data.js              # Ejecutar con usuario aleatorio');
        console.log('  node run_test_with_data.js multiple [N] # Ejecutar N tests (default: 3)');
        console.log('  node run_test_with_data.js user [INDEX] # Ejecutar con usuario específico');
        console.log('\n📊 Usuarios disponibles:');
        
        runner.loadTestData();
        runner.testData.users.forEach((user, index) => {
            console.log(`  ${index}: ${user.firstName} ${user.lastName} (${user.email})`);
        });
    }
}

// Manejo de señales para cleanup
process.on('SIGINT', () => {
    console.log('\n🛑 Proceso interrumpido, restaurando archivo original...');
    const runner = new TestRunner();
    runner.loadOriginalSideFile();
    runner.restoreOriginalSideFile();
    process.exit(0);
});

// Ejecutar
main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});
