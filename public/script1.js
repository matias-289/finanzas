document.addEventListener("DOMContentLoaded", () => {
  console.log("Script cargado correctamente");

  const inputNumero = document.getElementById("numero");
  const btnNuevo = document.getElementById("nuevo");
  const inputFecha = document.getElementById("fecha");
  const inputHora = document.getElementById("hora");

  // Botón 'Nuevo'
  if (btnNuevo && inputNumero) {
    btnNuevo.addEventListener("click", () => {
      console.log("Botón 'Nuevo' clickeado");

      fetch("https://192.168.195.20:5000/nuevo_numero")
        .then(response => {
          if (!response.ok) throw new Error("Error al obtener nuevo número");
          return response.json();
        })
        .then(data => {
          console.log("Respuesta recibida:", data);
          if (data.numero !== undefined) {
            inputNumero.value = data.numero;
            inputNumero.disabled = true;

            // Establecer fecha y hora actual
            const ahora = new Date();
            if (inputFecha) {
              inputFecha.value = ahora.toISOString().split("T")[0]; // YYYY-MM-DD
            }
            if (inputHora) {
              const horas = ahora.getHours().toString().padStart(2, "0");
              const minutos = ahora.getMinutes().toString().padStart(2, "0");
              inputHora.value = `${horas}:${minutos}`;
            }

          } else {
            alert("El servidor no devolvió un número válido.");
          }
        })
        .catch(error => {
          console.error("Error en la solicitud:", error);
          alert("No se pudo obtener un nuevo número del servidor.");
        });
    });
  }

  // Registrar Gasto
  const formGasto = document.getElementById("formGasto");
  if (formGasto) {
    formGasto.addEventListener("submit", async function (e) {
      e.preventDefault();

      const datos = {
        tipo: "Gasto",
        numero: parseInt(document.getElementById("numero").value),
        descripcion: document.getElementById("descripcion").value,
        monto: parseFloat(document.getElementById("monto").value),
        moneda: document.getElementById("moneda").value,
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value
      };

      try {
        const res = await fetch("http://192.168.195.20:5000/registrar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos)
        });

        const json = await res.json();
        alert(json.mensaje || json.error);
      } catch (err) {
        alert("Error al guardar el gasto");
        console.error(err);
      }
    });
  }

  // Registrar Entrada
  const formEntrada = document.getElementById("formEntrada");
  if (formEntrada) {
    formEntrada.addEventListener("submit", async function (e) {
      e.preventDefault();

      const datos = {
        tipo: "Entrada",
        numero: parseInt(document.getElementById("numero").value),
        descripcion: document.getElementById("descripcion").value,
        monto: parseFloat(document.getElementById("monto").value),
        moneda: document.getElementById("moneda").value,
        fecha: document.getElementById("fecha").value,
        hora: document.getElementById("hora").value
      };

      try {
        const res = await fetch("http://192.168.195.20:5000/registrar_entrada", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos)
        });

        const json = await res.json();
        alert(json.mensaje || json.error);
      } catch (err) {
        alert("Error al guardar la entrada");
        console.error(err);
      }
    });
  }
});
