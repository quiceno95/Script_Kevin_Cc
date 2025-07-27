#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script SOLO para preparar datos en el archivo .side
 * NO ejecuta el test - eso se hace manualmente después
 */

class DataPreparation {
    constructor() {
        this.dataFile = path.join(__dirname, 'test_data_expanded.json');
        this.sideFile = path.join(__dirname, 'Tets Metdo De Pago.side');
        this.backupFile = path.join(__dirname, 'Tets Metdo De Pago.side.backup');
        this.currentUserFile = path.join(__dirname, '.current_user.json');
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

    saveCurrentUser(userData, userIndex) {
        try {
            const currentUser = {
                user: userData,
                index: userIndex,
                timestamp: new Date().toISOString()
            };
            fs.writeFileSync(this.currentUserFile, JSON.stringify(currentUser, null, 2));
            console.log(`💾 Usuario actual guardado: ${userData.firstName} ${userData.lastName}`);
        } catch (error) {
            console.error('⚠️  Error al guardar usuario actual:', error.message);
        }
    }

    getCurrentUser() {
        try {
            if (fs.existsSync(this.currentUserFile)) {
                const data = fs.readFileSync(this.currentUserFile, 'utf8');
                return JSON.parse(data);
            }
            return null;
        } catch (error) {
            return null;
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

            // Leer archivo original o backup
            let fileContent;
            if (fs.existsSync(this.backupFile)) {
                fileContent = fs.readFileSync(this.backupFile, 'utf8');
            } else {
                fileContent = fs.readFileSync(this.sideFile, 'utf8');
            }

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
            console.log('\n🔄 Realizando reemplazos:');
            replacements.forEach(({ field, search, replace }) => {
                if (fileContent.includes(search)) {
                    fileContent = fileContent.replace(search, replace);
                    replacementCount++;
                    console.log(`✅ ${field}: ${search} → ${replace}`);
                } else {
                    console.log(`⚠️  ${field}: ${search} (NO ENCONTRADO)`);
                }
            });

            // Reemplazo especial para email (múltiples ocurrencias)
            const emailSearch = '"value": "Brandrfg78@gmail.com"';
            const emailReplace = `"value": "${userData.email}"`;
            const emailMatches = (fileContent.match(new RegExp(emailSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
            
            if (emailMatches > 0) {
                fileContent = fileContent.replace(new RegExp(emailSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), emailReplace);
                console.log(`✅ Email: ${emailSearch} → ${emailReplace} (${emailMatches} ocurrencias)`);
                replacementCount++;
            } else {
                console.log(`⚠️  Email: ${emailSearch} (NO ENCONTRADO)`);
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
            
            // Guardar información del usuario actual
            this.saveCurrentUser(userData, userIndex);
            
            console.log(`\n📝 Archivo .side actualizado con ${replacementCount} reemplazos exitosos`);
            console.log('📊 Campos actualizados: Nombre, Apellido, Email, Dirección, Teléfono, Tarjeta, CVV, Expiración');
            console.log('✅ Datos preparados correctamente');
            console.log('\n🚀 AHORA PUEDES EJECUTAR: npm test');
            console.log('🔄 Para restaurar datos originales: npm run restore');
            
            return true;
        } catch (error) {
            console.error('❌ Error al preparar archivo:', error.message);
            return false;
        }
    }

    showCurrentUser() {
        const current = this.getCurrentUser();
        if (current) {
            console.log('\n📋 USUARIO ACTUALMENTE CONFIGURADO:');
            console.log('='.repeat(50));
            console.log(`👤 ${current.user.firstName} ${current.user.lastName} (Usuario #${current.index})`);
            console.log(`📧 ${current.user.email}`);
            console.log(`📱 ${current.user.phone}`);
            console.log(`🏠 ${current.user.address}`);
            console.log(`💳 ${current.user.creditCardName}`);
            console.log(`🔢 ${current.user.creditCardNumber}`);
            console.log(`📅 ${current.user.expirationMonth}/${current.user.expirationYear}`);
            console.log(`🔒 ${current.user.securityCode}`);
            console.log(`⏰ Configurado: ${new Date(current.timestamp).toLocaleString()}`);
            console.log('\n🚀 Para ejecutar test: npm test');
            console.log('🔄 Para cambiar usuario: npm run prepare-next');
        } else {
            console.log('\n📋 No hay usuario configurado actualmente');
            console.log('🚀 Para configurar: npm run prepare-next');
        }
    }

    prepareNext(userIndex = null) {
        console.log('\n' + '='.repeat(60));
        console.log('📋 PREPARAR DATOS PARA PRÓXIMO TEST');
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
            return this.prepareFileWithUserData(userData, selectedIndex);

        } catch (error) {
            console.error('❌ Error crítico:', error.message);
            return false;
        }
    }

    cleanup() {
        try {
            // Restaurar archivo original
            this.restoreFromBackup();
            
            // Limpiar archivos temporales
            const tempFiles = [this.usedIndicesFile, this.currentUserFile];
            tempFiles.forEach(file => {
                if (fs.existsSync(file)) {
                    fs.unlinkSync(file);
                }
            });
            
            console.log('🧹 Limpieza completada - archivo original restaurado');
            return true;
        } catch (error) {
            console.error('⚠️  Error durante limpieza:', error.message);
            return false;
        }
    }
}

// Función principal
async function main() {
    const args = process.argv.slice(2);
    const prep = new DataPreparation();

    if (args.length === 0 || args[0] === 'next') {
        // Preparar siguiente usuario
        await prep.prepareNext();
    } else if (args[0] === 'user') {
        // Preparar usuario específico
        const userIndex = parseInt(args[1]);
        if (isNaN(userIndex)) {
            console.error('❌ Índice de usuario inválido');
            process.exit(1);
        }
        await prep.prepareNext(userIndex);
    } else if (args[0] === 'current') {
        // Mostrar usuario actual
        prep.showCurrentUser();
    } else if (args[0] === 'restore') {
        // Restaurar archivo original
        prep.restoreFromBackup();
        console.log('✅ Archivo original restaurado');
    } else if (args[0] === 'cleanup') {
        // Limpiar todo
        prep.cleanup();
    } else {
        console.log('📖 Uso:');
        console.log('  node prepare_data_only.js [next]         # Preparar siguiente usuario aleatorio');
        console.log('  node prepare_data_only.js user [INDEX]   # Preparar usuario específico');
        console.log('  node prepare_data_only.js current        # Mostrar usuario actual');
        console.log('  node prepare_data_only.js restore        # Restaurar archivo original');
        console.log('  node prepare_data_only.js cleanup        # Limpiar archivos temporales');
        console.log('');
        console.log('📋 Flujo recomendado:');
        console.log('  1. npm run prepare-next    # Preparar datos');
        console.log('  2. npm test               # Ejecutar test');
        console.log('  3. Repetir desde paso 1');
    }
}

// Ejecutar
main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});
