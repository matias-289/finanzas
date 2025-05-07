document.addEventListener("DOMContentLoaded", () => {
    console.log("Cargando informe de movimientos");

    fetch("http://192.168.195.20:5000/informe")
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener el informe");
        }
        return response.json();
      })
      .then(data => {
        console.log("Datos recibidos del informe:", data);

        // Ordenamos los movimientos de más reciente a más antiguo
        data.sort((a, b) => {
          // Creamos la fecha y hora completa para cada movimiento
          const fechaHoraA = new Date(`${a.fecha}T${a.hora}`);
          const fechaHoraB = new Date(`${b.fecha}T${b.hora}`);
          
          // Comparamos las fechas y horas (más reciente primero)
          return fechaHoraB - fechaHoraA;
        });

        const tablaMovimientos = document.getElementById("tablaMovimientos").getElementsByTagName('tbody')[0];

        data.forEach((movimiento, index) => {
          const fila = document.createElement("tr");

          // Número (basado en el índice)
          fila.innerHTML += `<td data-label="Número">${index + 1}</td>`;

          // Descripción
          fila.innerHTML += `<td data-label="Descripción">${movimiento.descripcion}</td>`;

          // Monto y Moneda
          let monto = 0;
          let moneda = "";
          if (movimiento.monto_gs) {
            monto = movimiento.monto_gs;
            moneda = "PYG";
          } else if (movimiento.monto_rs) {
            monto = movimiento.monto_rs;
            moneda = "BRL";
          } else if (movimiento.monto_us) {
            monto = movimiento.monto_us;
            moneda = "USD";
          }

          // Formateo del monto
          let montoFormateado = monto.toLocaleString('es-PY'); // Formato por defecto para guaraní
          if (moneda === "BRL" || moneda === "USD") {
            montoFormateado = monto.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Para BRL y USD
          }

          fila.innerHTML += `<td data-label="Monto">${montoFormateado}</td>`;
          fila.innerHTML += `<td data-label="Moneda">${moneda}</td>`;

          // Fecha y hora
          fila.innerHTML += `<td data-label="Fecha">${movimiento.fecha}</td>`;
          fila.innerHTML += `<td data-label="Hora">${movimiento.hora}</td>`;

          tablaMovimientos.appendChild(fila);
        });
      })
      .catch(error => {
        console.error("Error al cargar los datos del informe:", error);
        alert("No se pudo cargar el informe de movimientos.");
      });
});
