// Función para obtener los saldos desde el servidor
async function obtenerSaldo() {
    try {
      const response = await fetch('/saldo');
      if (response.ok) {
        const data = await response.json();
        
        // Formatear los saldos según el formato requerido
        const formatoGs = new Intl.NumberFormat('es-PY', { style: 'decimal', maximumFractionDigits: 0 }).format(data.total_monto_gs || 0);
        const formatoRs = new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.total_monto_rs || 0);
        const formatoUsd = new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.total_monto_us || 0);
  
        // Actualiza los saldos en el HTML
        document.getElementById('saldo-gs').textContent = `₲ ${formatoGs}`;
        document.getElementById('saldo-rs').textContent = `R$ ${formatoRs}`;
        document.getElementById('saldo-usd').textContent = `$ ${formatoUsd}`;
      } else {
        console.error('Error al obtener el saldo');
      }
    } catch (error) {
      console.error('Error al obtener los datos del saldo:', error);
    }
  }
  
  // Llama a la función al cargar la página
  window.onload = obtenerSaldo;
  