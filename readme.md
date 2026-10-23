# Clínica Salud — prototipo sin base de datos

Proyecto inicial para practicar HTML, CSS y JavaScript. En esta primera versión el CSS se dejó pendiente y la información se simula con arreglos dentro de `js/app.js`.

## Cómo abrirlo

Abre `login.html` en tu navegador. Las credenciales de demostración son:

- Usuario: `admin`
- Contraseña: `admin`

1. Valida un inicio de sesión básico.
2. Permite registrar pacientes con una contraseña de ocho caracteres como mínimo, una mayúscula y una minúscula.
3. Muestra médicos según la especialidad seleccionada.
4. Muestra un calendario mensual con botones para cambiar de mes. Solo permite elegir los días que tienen horas disponibles para el médico.
5. Oculta los horarios que ya están ocupados y no permite reservarlos de nuevo.
6. Guarda las nuevas citas y los nuevos usuarios en el almacenamiento local del navegador para que no se pierdan al recargar la página.

- Para reiniciar las citas de prueba `localStorage.removeItem('clinicaSaludCitas')` en la consola del navegador.

