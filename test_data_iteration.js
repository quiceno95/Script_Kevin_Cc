#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script de prueba para verificar la iteración y reemplazo de datos
 * Sin ejecutar el test de Selenium, solo muestra cómo se procesan los datos
 */

class DataIterationTest {
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
            console.log(`📊 Datos cargados: ${this.testData.users.length} usuarios disponibles\n`);
            return true;
        } catch (error) {
            console.error('❌ Error al cargar datos de prueba:', error.message);
            return false;
        }
    }

    loadOriginalSideFile() {
        try {
            this.originalSideContent = fs.readFileSync(this.sideFile, 'utf8');
            console.log('📁 Archivo .side original cargado\n');
            return true;
        } catch (error) {
            console.error('❌ Error al cargar archivo .side:', error.message);
            return false;
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
            return { user: this.testData.users[0], index: 0 };
        }

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        this.usedIndices.add(randomIndex);
        return { user: this.testData.users[randomIndex], index: randomIndex };
    }

    showCurrentValuesInSideFile() {
        console.log('🔍 VALORES ACTUALES EN EL ARCHIVO .SIDE:');
        console.log('=' .repeat(50));
        
        // Buscar valores actuales
        const currentValues = {
            firstName: this.extractValue('Yair Rogher'),
            lastName: this.extractValue('Frank Flander'),
            address: this.extractValue('7898 - Holl Street AV Hilt'),
            city: this.extractValue('New Brunswick'),
            zipCode: this.extractValue('08901'),
            phone: this.extractValue('867-348-2378'),
            email: this.extractValue('Brandrfg78@gmail.com')
        };

        Object.entries(currentValues).forEach(([field, value]) => {
            console.log(`${field.padEnd(12)}: "${value}"`);
        });
        console.log('');
    }

    extractValue(searchValue) {
        const regex = new RegExp(`"value": "${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
        const matches = this.originalSideContent.match(regex);
        return matches ? searchValue : 'NO ENCONTRADO';
    }

    simulateDataReplacement(userData, userIndex) {
        console.log(`👤 USUARIO SELECCIONADO #${userIndex}:`);
        console.log('=' .repeat(50));
        console.log(`Nombre completo: ${userData.firstName} ${userData.lastName}`);
        console.log(`Email         : ${userData.email}`);
        console.log(`Teléfono      : ${userData.phone}`);
        console.log(`Dirección     : ${userData.address}`);
        console.log(`Ciudad        : ${userData.city}`);
        console.log(`Estado        : ${userData.state}`);
        console.log(`Código postal : ${userData.zipCode}`);
        console.log(`Educación     : ${userData.education}`);
        console.log('');

        // Simular reemplazos
        console.log('🔄 REEMPLAZOS QUE SE REALIZARÍAN:');
        console.log('=' .repeat(50));
        
        const replacements = [
            { field: 'Nombre', from: 'Yair Rogher', to: userData.firstName },
            { field: 'Apellido', from: 'Frank Flander', to: userData.lastName },
            { field: 'Dirección', from: '7898 - Holl Street AV Hilt', to: userData.address },
            { field: 'Ciudad', from: 'New Brunswick', to: userData.city },
            { field: 'Código postal', from: '08901', to: userData.zipCode },
            { field: 'Teléfono', from: '867-348-2378', to: userData.phone },
            { field: 'Email', from: 'Brandrfg78@gmail.com', to: userData.email }
        ];

        replacements.forEach(({ field, from, to }) => {
            console.log(`${field.padEnd(15)}: "${from}" → "${to}"`);
        });
        console.log('');
    }

    testActualReplacement(userData) {
        console.log('🧪 PROBANDO REEMPLAZO REAL EN CONTENIDO:');
        console.log('=' .repeat(50));
        
        let updatedContent = this.originalSideContent;
        let replacementCount = 0;

        const replacements = [
            { search: '"value": "Yair Rogher"', replace: `"value": "${userData.firstName}"` },
            { search: '"value": "Frank Flander"', replace: `"value": "${userData.lastName}"` },
            { search: '"value": "7898 - Holl Street AV Hilt"', replace: `"value": "${userData.address}"` },
            { search: '"value": "New Brunswick"', replace: `"value": "${userData.city}"` },
            { search: '"value": "08901"', replace: `"value": "${userData.zipCode}"` },
            { search: '"value": "867-348-2378"', replace: `"value": "${userData.phone}"` }
        ];

        replacements.forEach(({ search, replace }) => {
            const beforeLength = updatedContent.length;
            updatedContent = updatedContent.replace(search, replace);
            const afterLength = updatedContent.length;
            
            if (beforeLength !== afterLength || updatedContent.includes(replace)) {
                console.log(`✅ ${search} → ${replace}`);
                replacementCount++;
            } else {
                console.log(`❌ ${search} (NO ENCONTRADO)`);
            }
        });

        // Email con reemplazo global
        const emailSearch = '"value": "Brandrfg78@gmail.com"';
        const emailReplace = `"value": "${userData.email}"`;
        const emailMatches = (updatedContent.match(new RegExp(emailSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        
        if (emailMatches > 0) {
            updatedContent = updatedContent.replace(new RegExp(emailSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), emailReplace);
            console.log(`✅ ${emailSearch} → ${emailReplace} (${emailMatches} ocurrencias)`);
            replacementCount++;
        } else {
            console.log(`❌ ${emailSearch} (NO ENCONTRADO)`);
        }

        console.log(`\n📊 Total de reemplazos exitosos: ${replacementCount}/7`);
        console.log('');

        return updatedContent;
    }

    runIterationTest(iterations = 3) {
        console.log('\n' + '='.repeat(60));
        console.log('🧪 TEST DE ITERACIÓN DE DATOS');
        console.log('='.repeat(60));

        if (!this.loadTestData() || !this.loadOriginalSideFile()) {
            return false;
        }

        this.showCurrentValuesInSideFile();

        for (let i = 0; i < iterations; i++) {
            console.log(`\n${'█'.repeat(60)}`);
            console.log(`📋 ITERACIÓN ${i + 1} de ${iterations}`);
            console.log('█'.repeat(60));

            const { user, index } = this.getNextUserData();
            this.simulateDataReplacement(user, index);
            
            const updatedContent = this.testActualReplacement(user);
            
            console.log('⏳ Simulando pausa entre iteraciones...');
            console.log('');
        }

        console.log('='.repeat(60));
        console.log('✅ TEST DE ITERACIÓN COMPLETADO');
        console.log('='.repeat(60));
        console.log(`📊 Usuarios utilizados: ${this.usedIndices.size}/${this.testData.users.length}`);
        console.log(`🔄 Usuarios restantes: ${this.testData.users.length - this.usedIndices.size}`);
        
        return true;
    }

    listAllUsers() {
        console.log('\n📊 USUARIOS DISPONIBLES EN test_data.json:');
        console.log('='.repeat(60));
        
        if (!this.loadTestData()) {
            return false;
        }

        this.testData.users.forEach((user, index) => {
            console.log(`${index.toString().padStart(2)}: ${user.firstName} ${user.lastName}`);
            console.log(`    📧 ${user.email}`);
            console.log(`    📱 ${user.phone}`);
            console.log(`    🏠 ${user.address}, ${user.city}, ${user.state} ${user.zipCode}`);
            console.log(`    🎓 ${user.education}`);
            console.log('');
        });

        return true;
    }
}

// Función principal
async function main() {
    const args = process.argv.slice(2);
    const tester = new DataIterationTest();

    if (args.length === 0 || args[0] === 'test') {
        // Test de iteración por defecto
        const iterations = parseInt(args[1]) || 3;
        await tester.runIterationTest(iterations);
    } else if (args[0] === 'list') {
        // Listar usuarios
        tester.listAllUsers();
    } else if (args[0] === 'single') {
        // Test con un solo usuario
        const userIndex = parseInt(args[1]) || 0;
        if (!tester.loadTestData() || !tester.loadOriginalSideFile()) {
            process.exit(1);
        }
        
        if (userIndex >= 0 && userIndex < tester.testData.users.length) {
            const userData = tester.testData.users[userIndex];
            tester.simulateDataReplacement(userData, userIndex);
            tester.testActualReplacement(userData);
        } else {
            console.error(`❌ Índice inválido. Debe estar entre 0 y ${tester.testData.users.length - 1}`);
        }
    } else {
        console.log('📖 Uso:');
        console.log('  node test_data_iteration.js [test] [N]  # Test de iteración (N iteraciones, default: 3)');
        console.log('  node test_data_iteration.js list        # Listar todos los usuarios');
        console.log('  node test_data_iteration.js single [I]  # Test con usuario específico (índice I)');
    }
}

// Ejecutar
main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});
