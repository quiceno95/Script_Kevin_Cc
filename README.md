sudo apt install -y xvfb
xvfb-run npx selenium-side-runner -c "browserName=chrome" 'Tets Metdo De Pago.side'




# Test de Automatización - Método de Pago

Este proyecto automatiza el proceso de registro y método de pago en `mycan.ceramicartsnetwork.org` usando Selenium IDE y Selenium Side Runner.

## 📁 Estructura del Proyecto

```
Script_Kevin_Cc/
├── Tets Metdo De Pago.side    # Archivo de test de Selenium IDE
├── test_data.json             # Datos de usuarios para testing
├── run_test_with_data.js      # Script para ejecutar con datos dinámicos
├── .side.yml                  # Configuración de Selenium Side Runner
├── package.json               # Configuración de npm y scripts
└── README.md                  # Esta documentación
```

## 🚀 Comandos Disponibles

### Tests Básicos
```bash
# Ejecutar test básico (datos fijos del archivo .side)
npm test

# Ejecutar con información de debug
npm run test-debug

# Ejecutar con timeout extendido
npm run test-timeout
```

### Tests con Datos Dinámicos
```bash
# Ejecutar con usuario aleatorio del JSON
npm run test-random

# Ejecutar 3 tests consecutivos con diferentes usuarios
npm run test-multiple

# Ejecutar 5 tests consecutivos con diferentes usuarios
npm run test-multiple-5

# Ver lista de usuarios disponibles
npm run list-users

# Ejecutar con usuario específico (índice 0-9)
npm run test-user 0
```

## 📊 Datos de Prueba

El archivo `test_data.json` contiene 10 usuarios diferentes con:
- ✅ Nombres y apellidos únicos
- ✅ Direcciones diferentes
- ✅ Emails únicos (formato: nombre.apellido.00X@gmail.com)
- ✅ Números de teléfono únicos
- ✅ Estados y códigos postales variados
- ✅ Niveles educativos diversos

### Usuarios Disponibles:
1. Travis Jones (travis.jones.001@gmail.com)
2. Maria Garcia (maria.garcia.002@gmail.com)
3. John Smith (john.smith.003@gmail.com)
4. Ana Rodriguez (ana.rodriguez.004@gmail.com)
5. David Wilson (david.wilson.005@gmail.com)
6. Carmen Lopez (carmen.lopez.006@gmail.com)
7. Michael Brown (michael.brown.007@gmail.com)
8. Sofia Martinez (sofia.martinez.008@gmail.com)
9. Robert Davis (robert.davis.009@gmail.com)
10. Isabella Hernandez (isabella.hernandez.010@gmail.com)

## 🔧 Configuración

### Archivo .side.yml
Configuración optimizada para:
- ⏱️ Timeout de 30 segundos
- 🔄 2 reintentos automáticos
- 🚫 Desactivación de notificaciones
- 🍪 Manejo automático de banners de cookies

### Características del Sistema
- 🎯 **Selección inteligente**: Evita reutilizar usuarios hasta agotar la lista
- 🔄 **Restauración automática**: El archivo .side original se restaura después de cada test
- 📊 **Reportes detallados**: Muestra estadísticas de éxito/fallo
- ⚡ **Ejecución rápida**: ~1 minuto por test
- 🛡️ **Manejo de errores**: Cleanup automático en caso de interrupción

## 📝 Ejemplos de Uso

### Ejecutar un test rápido
```bash
npm run test-random
```

### Ejecutar múltiples tests para validar estabilidad
```bash
npm run test-multiple-5
```

### Probar con un usuario específico
```bash
# Ver usuarios disponibles
npm run list-users

# Ejecutar con el usuario #3 (John Smith)
npm run test-user 3
```

## 🐛 Solución de Problemas

### El test falla por "element click intercepted"
- ✅ **Solución**: La configuración `.side.yml` maneja esto automáticamente con reintentos

### Error "email already registered"
- ✅ **Solución**: Usa `npm run test-random` o `npm run test-multiple` para usar emails únicos

### El navegador no se abre
- ✅ **Verificar**: Chrome está instalado y actualizado
- ✅ **Verificar**: ChromeDriver está en el PATH

### Test muy lento
- ✅ **Solución**: Usa `npm run test-timeout` para tests más largos

## 📈 Monitoreo y Logs

El sistema proporciona logs detallados:
- 📊 Usuario seleccionado y datos utilizados
- ⏱️ Tiempo de ejecución
- ✅ Estado de reemplazos de datos
- 🔄 Información de backup y restauración

## 🚀 Ejecutar en Otra Máquina

### Requisitos del Sistema

#### **Obligatorios:**
- **Node.js** v16+ (recomendado v18+)
- **Google Chrome** (versión reciente)
- **Git** (para clonar el proyecto)

#### **Sistemas Operativos Soportados:**
- ✅ **macOS** (Intel/Apple Silicon)
- ✅ **Windows** 10/11
- ✅ **Linux** (Ubuntu, CentOS, etc.)

### Pasos de Instalación

#### **1. Verificar Node.js**
```bash
# Verificar versión de Node.js
node --version
npm --version

# Si no tienes Node.js, descárgalo de: https://nodejs.org
```

#### **2. Verificar Google Chrome**
```bash
# En macOS/Linux
google-chrome --version
# o
chromium --version

# En Windows
# Verificar desde: chrome://version/
```

#### **3. Transferir el Proyecto**

**Opción A: Copiar archivos manualmente**
```bash
# Crear directorio del proyecto
mkdir selenium-automation
cd selenium-automation

# Copiar estos archivos esenciales:
# - Tets Metdo De Pago.side
# - Tets Metdo De Pago.side.backup
# - .side.yml
# - test_data_expanded.json
# - prepare_data_only.js
# - package.json
# - README.md
```

**Opción B: Usar Git (recomendado)**
```bash
# Si el proyecto está en un repositorio
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

#### **4. Instalar Dependencias**
```bash
# Instalar dependencias del proyecto
npm install

# Esto instalará automáticamente:
# - selenium-side-runner
# - chromedriver (compatible con tu Chrome)
```

#### **5. Verificar Instalación**
```bash
# Verificar que selenium-side-runner funciona
npx selenium-side-runner --version

# Verificar que chromedriver funciona
npx chromedriver --version
```

### Configuración Específica por SO

#### **macOS**
```bash
# Si tienes problemas con permisos de ChromeDriver
sudo xattr -d com.apple.quarantine /usr/local/bin/chromedriver

# O instalar ChromeDriver con Homebrew
brew install chromedriver
```

#### **Windows**
```bash
# Asegúrate de que Chrome esté en el PATH
# Usualmente en: C:\Program Files\Google\Chrome\Application\chrome.exe

# Si hay problemas, instalar ChromeDriver manualmente:
# 1. Descargar de: https://chromedriver.chromium.org
# 2. Agregar al PATH del sistema
```

#### **Linux (Ubuntu/Debian)**
```bash
# Instalar Chrome si no está instalado
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt update
sudo apt install google-chrome-stable

# Instalar dependencias adicionales si es necesario
sudo apt install -y libgconf-2-4 libxss1 libxtst6 libxrandr2 libasound2 libpangocairo-1.0-0 libatk1.0-0 libcairo-gobject2 libgtk-3-0 libgdk-pixbuf2.0-0
```

### Prueba de Funcionamiento

```bash
# 1. Ver usuarios disponibles
npm run show-expanded-data

# 2. Preparar datos de prueba
npm run prepare-next

# 3. Verificar configuración
npm run show-current

# 4. Ejecutar test de prueba
npm test
```

### Archivos Esenciales para Transferir

#### **📁 Archivos Obligatorios:**
```
✅ Tets Metdo De Pago.side          # Test principal
✅ Tets Metdo De Pago.side.backup   # Backup original
✅ .side.yml                        # Configuración Selenium
✅ test_data_expanded.json          # Datos de usuarios
✅ prepare_data_only.js             # Script de preparación
✅ package.json                     # Dependencias
✅ README.md                        # Documentación
```

#### **📁 Archivos Generados (se crean automáticamente):**
```
🔄 .current_user.json               # Usuario actual
🔄 .used_indices.json               # Índices usados
🔄 node_modules/                    # Dependencias (npm install)
🔄 package-lock.json               # Lock de dependencias
```

### Solución de Problemas Comunes

#### **Error: "chromedriver not found"**
```bash
# Reinstalar chromedriver
npm uninstall chromedriver
npm install chromedriver

# O instalar globalmente
npm install -g chromedriver
```

#### **Error: "Chrome binary not found"**
```bash
# Verificar ruta de Chrome y actualizar .side.yml si es necesario
# En Windows: C:\Program Files\Google\Chrome\Application\chrome.exe
# En macOS: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
# En Linux: /usr/bin/google-chrome
```

#### **Error: "Permission denied"**
```bash
# En macOS/Linux
chmod +x node_modules/.bin/selenium-side-runner
chmod +x node_modules/.bin/chromedriver
```

### Comandos de Verificación Completa

```bash
# Script de verificación completa
echo "🔍 Verificando entorno..."
node --version
npm --version
google-chrome --version 2>/dev/null || chrome --version 2>/dev/null || echo "⚠️ Chrome no encontrado"
npx selenium-side-runner --version
echo "✅ Verificación completada"
```
- ✅/❌ Estado de cada paso
- 📈 Estadísticas finales de múltiples ejecuciones

## 🔄 Mantenimiento

### Agregar nuevos usuarios
1. Editar `test_data.json`
2. Agregar nuevo objeto en el array `users`
3. Asegurar email y teléfono únicos

### Modificar el flujo del test
1. Abrir `Tets Metdo De Pago.side` en Selenium IDE
2. Hacer modificaciones
3. Guardar archivo
4. Los cambios se aplicarán automáticamente

## ⚠️ Notas Importantes

- 🔒 **Emails únicos**: Cada usuario tiene un email único para evitar conflictos
- 🔄 **Rotación automática**: El sistema evita reutilizar usuarios hasta agotar la lista
- 🧹 **Cleanup**: El archivo .side original siempre se restaura
- ⏰ **Timeouts**: Configurados para manejar páginas lentas
- 🛡️ **Interrupciones**: Ctrl+C restaura automáticamente el archivo original

#npx selenium-side-runner \
  -c "browserName=chrome goog:chromeOptions.args=['--user-data-dir=/tmp/chrome-profile-$(date +%s)']" \
  "Tets Metdo De Pago.side"


npx selenium-side-runner \
  -c "browserName=chrome goog:chromeOptions.args=['--incognito']" \
  "Tets Metdo De Pago.side"

