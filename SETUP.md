# 🚀 Instalación Rápida - Selenium Automation

## ⚡ Configuración en 5 Minutos

### 1️⃣ **Requisitos Previos**
```bash
# Verificar Node.js (debe ser v16+)
node --version

# Verificar Chrome
google-chrome --version  # Linux/macOS
# o chrome://version/     # Windows
```

### 2️⃣ **Instalación**
```bash
# Clonar/copiar proyecto
cd selenium-automation

# Instalar dependencias
npm install

# Verificar instalación
npm run verify
```

### 3️⃣ **Prueba Rápida**
```bash
# Ver usuarios disponibles
npm run show-expanded-data

# Preparar datos de prueba
npm run prepare-next

# Ejecutar test
npm test
```

## 📋 Lista de Verificación

### ✅ **Archivos Obligatorios**
- [ ] `Tets Metdo De Pago.side` (archivo principal del test)
- [ ] `Tets Metdo De Pago.side.backup` (backup original)
- [ ] `.side.yml` (configuración de Selenium)
- [ ] `test_data_expanded.json` (15 usuarios de prueba)
- [ ] `prepare_data_only.js` (script de preparación)
- [ ] `package.json` (dependencias)
- [ ] `verify-environment.js` (verificación automática)

### ✅ **Dependencias del Sistema**
- [ ] Node.js v16+ instalado
- [ ] Google Chrome instalado
- [ ] npm funcionando
- [ ] Permisos de ejecución (macOS/Linux)

### ✅ **Dependencias npm**
- [ ] `selenium-side-runner` instalado
- [ ] `chromedriver` instalado
- [ ] Scripts npm disponibles

## 🔧 Solución Rápida de Problemas

### **Error: "chromedriver not found"**
```bash
npm install chromedriver --save
```

### **Error: "Chrome binary not found"**
```bash
# Verificar ruta de Chrome en .side.yml
# Windows: C:\Program Files\Google\Chrome\Application\chrome.exe
# macOS: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
# Linux: /usr/bin/google-chrome
```

### **Error: "Permission denied"**
```bash
# macOS/Linux
chmod +x node_modules/.bin/*
sudo xattr -d com.apple.quarantine node_modules/.bin/chromedriver
```

### **Test falla constantemente**
```bash
# Verificar configuración
npm run show-current

# Restaurar archivo original
npm run restore

# Preparar nuevos datos
npm run prepare-next
```

## 📞 Comandos de Emergencia

```bash
# Verificación completa del entorno
npm run verify

# Restaurar estado original
npm run restore

# Ver estado actual
npm run show-current

# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Flujo de Trabajo Típico

```bash
# 1. Verificar entorno
npm run verify

# 2. Ver usuarios disponibles
npm run show-expanded-data

# 3. Preparar datos aleatorios
npm run prepare-next

# 4. Ejecutar test
npm test

# 5. Repetir para más tests
npm run prepare-next && npm test
```

## 📊 Información del Sistema

- **15 usuarios de prueba** con datos completos
- **10 campos parametrizables** (nombre, email, tarjeta, etc.)
- **Ejecución única** (sin reintentos automáticos)
- **Backup automático** del archivo original
- **Multiplataforma** (Windows, macOS, Linux)

---

**💡 Tip:** Ejecuta `npm run verify` después de cualquier cambio en el entorno para asegurar que todo funciona correctamente.
