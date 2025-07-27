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
