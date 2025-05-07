from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from db import get_connection, init_db
from psycopg2.extras import RealDictCursor
import os

# Configuramos la ruta de los archivos estáticos correctamente
app = Flask(__name__, static_folder='../public', static_url_path='')
CORS(app)

@app.route('/')
def root():
    # Esta ruta sirve el archivo 'index.html' desde la carpeta public
    return send_from_directory('../public', 'index.html')

@app.route("/registrar", methods=["POST"])
def registrar():
    try:
        data = request.get_json()
        tipo = 'Gasto'
        numero = data.get("numero")
        descripcion = data.get("descripcion")
        monto = data.get("monto")
        categoria = data.get("moneda", "").lower()
        fecha = data.get("fecha")
        hora = data.get("hora")

        if categoria == "guarani":
            columna_monto = "monto_gs"
        elif categoria == "real":
            columna_monto = "monto_rs"
        elif categoria == "dolar":
            columna_monto = "monto_us"
        else:
            return jsonify({"error": "Moneda inválida"}), 400

        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(f"""
                    INSERT INTO movimientos (numero, tipo, descripcion, {columna_monto}, moneda, fecha, hora)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (numero, tipo, descripcion, monto, categoria, fecha, hora))
            conn.commit()

        return jsonify({"mensaje": f"{tipo.capitalize()} registrado correctamente"})

    except Exception as e:
        return jsonify({"error": f"Error en el servidor: {str(e)}"}), 500

@app.route("/registrar_entrada", methods=["POST"])
def registrar_entrada():
    try:
        data = request.get_json()
        tipo = 'Entrada'
        numero = data.get("numero")
        descripcion = data.get("descripcion")
        monto = data.get("monto")
        categoria = data.get("moneda", "").lower()
        fecha = data.get("fecha")
        hora = data.get("hora")

        if categoria == "guarani":
            columna_monto = "monto_gs"
        elif categoria == "real":
            columna_monto = "monto_rs"
        elif categoria == "dolar":
            columna_monto = "monto_us"
        else:
            return jsonify({"error": "Moneda inválida"}), 400

        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(f"""
                    INSERT INTO movimientos (numero, tipo, descripcion, {columna_monto}, moneda, fecha, hora)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (numero, tipo, descripcion, monto, categoria, fecha, hora))
            conn.commit()

        return jsonify({"mensaje": f"{tipo.capitalize()} registrado correctamente"})

    except Exception as e:
        return jsonify({"error": f"Error en el servidor: {str(e)}"}), 500
    
    
@app.route("/informe", methods=["GET"])
def informe():
    try:
        with get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Consulta que convierte la fecha y hora a cadenas de texto
                cur.execute("""
                    SELECT 
                        TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha, 
                        TO_CHAR(hora, 'HH24:MI:SS') AS hora, 
                        descripcion, 
                        tipo, 
                        monto_gs, 
                        monto_rs, 
                        monto_us 
                    FROM movimientos 
                    ORDER BY fecha DESC, hora DESC
                """)
                resultado = cur.fetchall()
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": f"Error al obtener el informe: {str(e)}"}), 500
    
@app.route("/saldo", methods=["GET"])
def saldo():
    try:
        with get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Consulta que suma los montos
                cur.execute("""
                    SELECT 
                        SUM(monto_gs) AS total_monto_gs,
                        SUM(monto_rs) AS total_monto_rs,
                        SUM(monto_us) AS total_monto_us
                    FROM movimientos
                """)
                resultado = cur.fetchone()  # Usamos fetchone() ya que solo esperamos una fila
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": f"Error al obtener el informe: {str(e)}"}), 500

@app.route("/nuevo_numero", methods=["GET"])
def nuevo_numero():
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT MAX(numero) FROM movimientos")
                max_numero = cur.fetchone()[0]
                nuevo_numero = (max_numero or 0) + 1
        return jsonify({"numero": nuevo_numero})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, ssl_context=("cert.pem", "key.pem"))
