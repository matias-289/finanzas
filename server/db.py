# db.py
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
}

def get_connection():
    return psycopg2.connect(**DB_CONFIG)

# Función para inicializar la base de datos (crear tablas)
def init_db():
    try:
        with open("server/models.sql", "r") as f:
            sql = f.read()
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql)
        print("Base de datos inicializada correctamente.")
    except FileNotFoundError:
        print("El archivo models.sql no se encuentra.")
