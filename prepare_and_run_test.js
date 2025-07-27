#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script para preparar el archivo .side con datos específicos ANTES de ejecutar el test
 * Esto evita problemas de sincronización y es más eficiente
 */

class PrepareAndRunTest {
    constructor() {
        this.dataFile = path.join(__dirname, 'test_data_expanded.json');
        this.sideFile = path.join(__dirname, 'Tets Metdo De Pago.side');
        this.backupFile = path.join(__dirname, 'Tets Metdo De Pago.side.backup');
        this.testData = null;
        this.usedIndicesFile = path.join(__dirname, '.used_indices.json');
    }

    loadTestData() {
        try {
            const data = fs.readFileSync(this.dataFile, 'utf8');
            this.testData = JSON.parse(data);
            console.log(`📊 Cargados ${this.testData.users.length} usuarios de prueba`);
            return true;
        } catch (error) {
            console.error('❌ Error al cargar datos de prueba:', error.message);
            return false;
        }
    }

    createBackup() {
        try {
            if (!fs.existsSync(this.backupFile)) {
                fs.copyFileSync(this.sideFile, this.backupFile);
                console.log('💾 Backup del archivo .side creado');
            }
            return true;
        } catch (error) {
            console.error('❌ Error al crear backup:', error.message);
            return false;
        }
    }

    restoreFromBackup() {
        try {
            if (fs.existsSync(this.backupFile)) {
                fs.copyFileSync(this.backupFile, this.sideFile);
                console.log('🔄 Archivo .side restaurado desde backup');
                return true;
            } else {
                console.log('⚠️  No se encontró archivo de backup');
                return false;
            }
        } catch (error) {
            console.error('❌ Error al restaurar desde backup:', error.message);
            return false;
        }
    }

    loadUsedIndices() {
        try {
            if (fs.existsSync(this.usedIndicesFile)) {
                const data = fs.readFileSync(this.usedIndicesFile, 'utf8');
                return new Set(JSON.parse(data));
            }
            return new Set();
        } catch (error) {
            console.log('ℹ️  Iniciando con lista de usuarios vacía');
            return new Set();
        }
    }

    saveUsedIndices(usedIndices) {
        try {
            fs.writeFileSync(this.usedIndicesFile, JSON.stringify([...usedIndices]));
        } catch (error) {
            console.error('⚠️  Error al guardar índices usados:', error.message);
        }
    }

    getNextUserData() {
        const usedIndices = this.loadUsedIndices();
        const availableIndices = [];
        
        for (let i = 0; i < this.testData.users.length; i++) {
            if (!usedIndices.has(i)) {
                availableIndices.push(i);
            }
        }

        if (availableIndices.length === 0) {
            console.log('🔄 Todos los usuarios han sido usados, reiniciando lista...');
            usedIndices.clear();
            this.saveUsedIndices(usedIndices);
            return { user: this.testData.users[0], index: 0 };
        }

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        usedIndices.add(randomIndex);
        this.saveUsedIndices(usedIndices);
        
        return { user: this.testData.users[randomIndex], index: randomIndex };
    }

    getUserByIndex(index) {
        if (index >= 0 && index < this.testData.users.length) {
            return { user: this.testData.users[index], index: index };
        }
        return null;
    }

    prepareFileWithUserData(userData, userIndex) {
        try {
            console.log(`\n👤 Preparando datos para: ${userData.firstName} ${userData.lastName} (Usuario #${userIndex})`);
            console.log(`📧 Email: ${userData.email}`);
            console.log(`📱 Teléfono: ${userData.phone}`);
            console.log(`🏠 Dirección: ${userData.address}`);
            console.log(`💳 Tarjeta: ${userData.creditCardName}`);
            console.log(`🔢 Número: ${userData.creditCardNumber}`);
            console.log(`📅 Expiración: ${userData.expirationMonth}/${userData.expirationYear}`);
            console.log(`🔒 CVV: ${userData.securityCode}`);

            // Leer archivo original
            let fileContent = fs.readFileSync(this.sideFile, 'utf8');

            // Definir reemplazos usando los valores actuales del archivo .side
            const replacements = [
                { field: 'Primer Nombre', search: '"value": "Yair Rogher"', replace: `"value": "${userData.firstName}"` },
                { field: 'Segundo Nombre', search: '"value": "Frank Flander"', replace: `"value": "${userData.lastName}"` },
                { field: 'Dirección', search: '"value": "7898 - Holl Street AV Hilt"', replace: `"value": "${userData.address}"` },
                { field: 'Teléfono', search: '"value": "867-348-2378"', replace: `"value": "${userData.phone}"` },
                { field: 'Nombre Tarjeta', search: '"value": "Brandon Greer"', replace: `"value": "${userData.creditCardName}"` },
                { field: 'Número Tarjeta', search: '"value": "4342580222032179"', replace: `"value": "${userData.creditCardNumber}"` },
                { field: 'Código Seguridad', search: '"value": "842"', replace: `"value": "${userData.securityCode}"` }
            ];

            // Realizar reemplazos simples
            let replacementCount = 0;
            replacements.forEach(({ search, replace }) => {
                if (fileContent.includes(search)) {
                    fileContent = fileContent.replace(search, replace);
                    replacementCount++;
                    console.log(`✅ ${search} → ${replace}`);
                } else {
                    console.log(`⚠️  ${search} (NO ENCONTRADO)`);
                }
            });

            // Reemplazo especial para email (múltiples ocurrencias)
            const emailSearch = '"value": "Brandrfg78@gmail.com"';
            const emailReplace = `"value": "${userData.email}"`;
            const emailMatches = (fileContent.match(new RegExp(emailSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
            
            if (emailMatches > 0) {
                fileContent = fileContent.replace(new RegExp(emailSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), emailReplace);
                console.log(`✅ ${emailSearch} → ${emailReplace} (${emailMatches} ocurrencias)`);
                replacementCount++;
            } else {
                console.log(`⚠️  ${emailSearch} (NO ENCONTRADO)`);
            }

            // Reemplazo para mes de expiración
            if (userData.expirationMonth) {
                const monthPattern = /"target": "value=label=05"/g;
                const monthMatches = (fileContent.match(monthPattern) || []).length;
                if (monthMatches > 0) {
                    fileContent = fileContent.replace(monthPattern, `"target": "value=${userData.expirationMonth}"`);
                    console.log(`✅ Mes Expiración: "label=05" → "${userData.expirationMonth}" (${monthMatches} ocurrencias)`);
                    replacementCount++;
                }
            }

            // Reemplazo para año de expiración
            if (userData.expirationYear) {
                const yearPattern = /"target": "value=label=2028"/g;
                const yearMatches = (fileContent.match(yearPattern) || []).length;
                if (yearMatches > 0) {
                    fileContent = fileContent.replace(yearPattern, `"target": "value=${userData.expirationYear}"`);
                    console.log(`✅ Año Expiración: "label=2028" → "${userData.expirationYear}" (${yearMatches} ocurrencias)`);
                    replacementCount++;
                }
            }

            // Escribir archivo modificado
            fs.writeFileSync(this.sideFile, fileContent);
            console.log(`\n📝 Archivo .side actualizado con ${replacementCount} reemplazos exitosos`);
            console.log('📊 Campos actualizados: Nombre, Apellido, Email, Dirección, Teléfono, Tarjeta, CVV, Expiración');
            console.log('✅ Archivo preparado para ejecución\n');
            
            return true;
        } catch (error) {
            console.error('❌ Error al preparar archivo:', error.message);
            return false;
        }
    }

    runSeleniumTest() {
        try {
            console.log('🚀 Ejecutando test de Selenium...\n');
            const result = execSync('npm test', { 
                cwd: __dirname, 
                stdio: 'inherit',
                encoding: 'utf8'
            });
            
            console.log('\n✅ Test completado exitosamente');
            return true;
        } catch (error) {
            console.log('\n❌ Test falló');
            // No mostrar el error completo aquí ya que se muestra con stdio: 'inherit'
            return false;
        }
    }

    async runSingleTest(userIndex = null) {
        console.log('\n' + '='.repeat(60));
        console.log('🧪 PREPARAR Y EJECUTAR TEST');
        console.log('='.repeat(60));

        try {
            // Cargar datos
            if (!this.loadTestData()) {
                return false;
            }

            // Crear backup si no existe
            if (!this.createBackup()) {
                return false;
            }

            // Seleccionar usuario
            let userData, selectedIndex;
            if (userIndex !== null) {
                const result = this.getUserByIndex(userIndex);
                if (!result) {
                    console.error(`❌ Índice de usuario inválido: ${userIndex}`);
                    return false;
                }
                userData = result.user;
                selectedIndex = result.index;
                console.log(`👤 Usando usuario específico #${selectedIndex}`);
            } else {
                const result = this.getNextUserData();
                userData = result.user;
                selectedIndex = result.index;
                console.log(`👤 Usuario seleccionado aleatoriamente #${selectedIndex}`);
            }

            // Preparar archivo .side
            if (!this.prepareFileWithUserData(userData, selectedIndex)) {
                return false;
            }

            // Ejecutar test
            const success = this.runSeleniumTest();

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
            // Restaurar archivo original
            this.restoreFromBackup();
        }
    }

    async runMultipleTests(count = 3) {
        console.log(`\n🔄 EJECUTANDO ${count} TESTS CONSECUTIVOS`);
        console.log('='.repeat(60));

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < count; i++) {
            console.log(`\n${'█'.repeat(60)}`);
            console.log(`📋 TEST ${i + 1} de ${count}`);
            console.log('█'.repeat(60));

            const success = await this.runSingleTest();
            
            if (success) {
                successCount++;
            } else {
                failCount++;
            }

            // Pausa entre tests
            if (i < count - 1) {
                console.log('\n⏳ Esperando 5 segundos antes del siguiente test...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMEN FINAL');
        console.log('='.repeat(60));
        console.log(`✅ Tests exitosos: ${successCount}`);
        console.log(`❌ Tests fallidos: ${failCount}`);
        console.log(`📈 Tasa de éxito: ${((successCount / count) * 100).toFixed(1)}%`);
        
        return successCount > 0;
    }

    cleanup() {
        try {
            // Limpiar archivo de índices usados si existe
            if (fs.existsSync(this.usedIndicesFile)) {
                fs.unlinkSync(this.usedIndicesFile);
                console.log('🧹 Archivo de índices usados eliminado');
            }
        } catch (error) {
            console.error('⚠️  Error durante limpieza:', error.message);
        }
    }
}

// Función principal
async function main() {
    const args = process.argv.slice(2);
    const runner = new PrepareAndRunTest();

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
    } else if (args[0] === 'cleanup') {
        // Limpiar archivos temporales
        runner.cleanup();
        runner.restoreFromBackup();
        console.log('✅ Limpieza completada');
    } else {
        console.log('📖 Uso:');
        console.log('  node prepare_and_run_test.js              # Ejecutar con usuario aleatorio');
        console.log('  node prepare_and_run_test.js multiple [N] # Ejecutar N tests (default: 3)');
        console.log('  node prepare_and_run_test.js user [INDEX] # Ejecutar con usuario específico');
        console.log('  node prepare_and_run_test.js cleanup      # Limpiar archivos temporales');
    }
}

// Manejo de señales para cleanup
process.on('SIGINT', () => {
    console.log('\n🛑 Proceso interrumpido, restaurando archivo original...');
    const runner = new PrepareAndRunTest();
    runner.restoreFromBackup();
    process.exit(0);
});

// Ejecutar
main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});
