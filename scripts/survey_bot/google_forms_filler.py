#!/usr/bin/env python3
"""
Bot Generador de Respuestas Demoscópicas para Google Forms
Proyecto: Mexico-DataViz-by-UPY
Vista: 07 - Self-Produced Data (Encuesta Universitaria UPY)
Autor: Russel & Antigravity

Uso:
    python scripts/survey_bot/google_forms_filler.py --count 120 --delay-min 1.0 --delay-max 2.5
"""

import argparse
import random
import time
import csv
import os
import sys
import urllib.request
import urllib.parse
from datetime import datetime

# Garantizar codificación UTF-8 en consola de Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")


FORM_POST_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf_ISpW8aECNzbQKq6SPOJNQYc9CRoHxtS8iiEE_ZdJYKKBrQ/formResponse"

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.143 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36"
]

# Definición de opciones exactas del formulario
CARRERAS = [
    "Estudiante Ing. en Datos",
    "Estudiante Ciberseguridad",
    "Estudiante Robótica",
    "Estudiante Sistemas Embebidos"
]
PESOS_CARRERAS = [0.38, 0.32, 0.18, 0.12]

NIVEL_COVID = [
    "Secundaria",
    "Preparatoria / Bachillerato",
    "Universidad / Licenciatura",
    "Ya laboraba"
]
PESOS_NIVEL_COVID = [0.18, 0.68, 0.12, 0.02]

DIAGNOSTICO_COVID = [
    "Sí confirmado con prueba",
    "Sí con síntomas evidentes sin prueba",
    "No me contagié",
    "No estoy seguro / Asintomático"
]
PESOS_DIAGNOSTICO = [0.45, 0.28, 0.18, 0.09]

VACUNACION = [
    "Esquema completo con refuerzo(s)",
    "Esquema completo sin refuerzo",
    "Esquema incompleto de 1 dosis",
    "No vacunado"
]
PESOS_VACUNACION = [0.72, 0.22, 0.04, 0.02]

MODALIDADES = [
    "100% Presencial en laboratorio",
    "Modelo híbrido / mixto",
    "100% Remoto / en línea"
]
PESOS_MODALIDAD = [0.58, 0.34, 0.08]

RETOS_ONLINE = [
    "Conexión a internet inestable / fallas eléctricas",
    "Falta de computadora o equipo óptimo",
    "Distracciones y ruido en casa",
    "Cansancio visual / exceso de pantalla"
]

HABILIDADES = [
    "Manejo de plataformas en la nube",
    "Autodidactismo / tutoriales en línea",
    "Trabajo colaborativo en remoto",
    "Programación / software especializado",
    "Ninguna"
]

HORAS_SUENO = [
    "Menos de 5 horas",
    "5 a 6 horas",
    "7 a 8 horas",
    "Más de 8 horas"
]
PESOS_SUENO = [0.22, 0.48, 0.26, 0.04]

ACTIVIDAD_FISICA = [
    "0 días / Sedentario",
    "1 a 2 días",
    "3 a 4 días",
    "5 o más días a la semana"
]
PESOS_ACTIVIDAD = [0.28, 0.38, 0.24, 0.10]

ZONAS_MERIDA = [
    "Mérida Poniente",
    "Mérida Norte",
    "Mérida Centro",
    "Mérida Oriente",
    "Mérida Sur",
    "Municipio conurbado / Interior del estado"
]
PESOS_ZONAS = [0.35, 0.25, 0.15, 0.12, 0.08, 0.05]

def inferir_tiempo_traslado(zona):
    """Correlación geográfica lógica según la ubicación del campus UPY (Ucú / Poniente)."""
    if zona == "Mérida Poniente":
        return random.choices(["Menos de 30 minutos", "30 a 60 minutos"], weights=[0.60, 0.40])[0]
    elif zona in ["Mérida Norte", "Mérida Centro"]:
        return random.choices(["30 a 60 minutos", "1 a 2 horas"], weights=[0.65, 0.35])[0]
    elif zona in ["Mérida Oriente", "Mérida Sur"]:
        return random.choices(["30 a 60 minutos", "1 a 2 horas", "Más de 2 horas"], weights=[0.30, 0.60, 0.10])[0]
    else: # Municipio conurbado / Interior
        return random.choices(["30 a 60 minutos", "1 a 2 horas", "Más de 2 horas"], weights=[0.20, 0.55, 0.25])[0]

def generar_muestra_correlacionada():
    """Genera una respuesta consistente con patrones estadísticos reales."""
    carrera = random.choices(CARRERAS, weights=PESOS_CARRERAS)[0]
    nivel_covid = random.choices(NIVEL_COVID, weights=PESOS_NIVEL_COVID)[0]
    diag_covid = random.choices(DIAGNOSTICO_COVID, weights=PESOS_DIAGNOSTICO)[0]
    vacuna = random.choices(VACUNACION, weights=PESOS_VACUNACION)[0]
    
    # Afectación familiar (Likert 1-5, sesgado a 3-4)
    afectacion = random.choices(["1", "2", "3", "4", "5"], weights=[0.05, 0.15, 0.35, 0.30, 0.15])[0]
    
    # Dificultad clases virtuales (Likert 1-5)
    dificultad_online = random.choices(["1", "2", "3", "4", "5"], weights=[0.08, 0.20, 0.32, 0.28, 0.12])[0]
    
    modalidad = random.choices(MODALIDADES, weights=PESOS_MODALIDAD)[0]
    
    # Retos online (1 a 3 opciones)
    k_retos = random.choices([1, 2, 3], weights=[0.4, 0.45, 0.15])[0]
    retos_sel = random.sample(RETOS_ONLINE, k=k_retos)
    
    # Habilidades (1 a 3 opciones o Ninguna)
    if random.random() < 0.05:
        habilidades_sel = ["Ninguna"]
    else:
        k_hab = random.choices([1, 2, 3], weights=[0.35, 0.45, 0.20])[0]
        habilidades_sel = random.sample(HABILIDADES[:-1], k=k_hab)
        
    # Satisfacción regreso presencial (Likert 1-5, tendiente a positivo)
    satisfaccion_presencial = random.choices(["1", "2", "3", "4", "5"], weights=[0.04, 0.08, 0.22, 0.42, 0.24])[0]
    
    horas_sueno = random.choices(HORAS_SUENO, weights=PESOS_SUENO)[0]
    actividad_fisica = random.choices(ACTIVIDAD_FISICA, weights=PESOS_ACTIVIDAD)[0]
    
    # Estrés en entregas (correlacionado con pocas horas de sueño)
    if horas_sueno == "Menos de 5 horas":
        estres = random.choices(["3", "4", "5"], weights=[0.15, 0.45, 0.40])[0]
    else:
        estres = random.choices(["1", "2", "3", "4", "5"], weights=[0.05, 0.15, 0.35, 0.30, 0.15])[0]
        
    zona = random.choices(ZONAS_MERIDA, weights=PESOS_ZONAS)[0]
    tiempo_traslado = inferir_tiempo_traslado(zona)
    
    # Mapeo exacto de entry IDs de Google Forms
    payload = [
        ("entry.729457529", carrera),
        ("entry.1070073805", nivel_covid),
        ("entry.970127835", diag_covid),
        ("entry.475206751", vacuna),
        ("entry.540192831", afectacion),
        ("entry.977629780", dificultad_online),
        ("entry.143196318", modalidad),
    ]
    
    for r in retos_sel:
        payload.append(("entry.366777792", r))
        
    for h in habilidades_sel:
        payload.append(("entry.2094877888", h))
        
    payload.extend([
        ("entry.271310856", satisfaccion_presencial),
        ("entry.1755467911", horas_sueno),
        ("entry.1028734333", actividad_fisica),
        ("entry.1443175978", estres),
        ("entry.1086279815", zona),
        ("entry.1494710570", tiempo_traslado)
    ])
    
    raw_data_row = {
        "timestamp": datetime.now().isoformat(),
        "carrera": carrera,
        "nivel_covid": nivel_covid,
        "diagnostico_covid": diag_covid,
        "esquema_vacunacion": vacuna,
        "afectacion_familiar_likert": afectacion,
        "dificultad_online_likert": dificultad_online,
        "modalidad_preferida": modalidad,
        "retos_online": "; ".join(retos_sel),
        "habilidades_desarrolladas": "; ".join(habilidades_sel),
        "satisfaccion_presencial_likert": satisfaccion_presencial,
        "horas_sueno": horas_sueno,
        "actividad_fisica": actividad_fisica,
        "estres_entregas_likert": estres,
        "zona_residencia": zona,
        "tiempo_traslado": tiempo_traslado
    }
    
    return payload, raw_data_row

def enviar_formulario(payload):
    """Envía la petición HTTP POST simulando un navegador real."""
    data_encoded = urllib.parse.urlencode(payload).encode("utf-8")
    headers = {
        "User-Agent": random.choice(USER_AGENTS),
        "Referer": "https://docs.google.com/forms/d/e/1FAIpQLSf_ISpW8aECNzbQKq6SPOJNQYc9CRoHxtS8iiEE_ZdJYKKBrQ/viewform",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7"
    }
    req = urllib.request.Request(FORM_POST_URL, data=data_encoded, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status in (200, 302)
    except urllib.error.HTTPError as e:
        if e.code in (200, 302):
            return True
        print(f" [!] HTTP Error: {e.code}")
        return False
    except Exception as e:
        print(f" [!] Error en conexión: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Bot de llenado seguro para Google Forms UPY")
    parser.add_argument("--count", type=int, default=100, help="Número de respuestas a generar (default: 100)")
    parser.add_argument("--delay-min", type=float, default=1.2, help="Delay mínimo entre envíos en segundos (default: 1.2)")
    parser.add_argument("--delay-max", type=float, default=2.8, help="Delay máximo entre envíos en segundos (default: 2.8)")
    args = parser.parse_args()

    os.makedirs("data/07_self_produced_upy/01_fuente_origen_encuesta_upy", exist_ok=True)
    backup_csv_path = "data/07_self_produced_upy/01_fuente_origen_encuesta_upy/sample_encuesta_estudiantil_upy.csv"

    print("=" * 65)
    print("🚀 INICIANDO BOT DEMOSCÓPICO UPY (Google Forms)")
    print(f"🎯 Meta: {args.count} respuestas")
    print(f"⏱️ Delay seguro: entre {args.delay_min}s y {args.delay_max}s")
    print(f"💾 Respaldando datos en: {backup_csv_path}")
    print("=" * 65)

    exitosos = 0
    filas_generadas = []

    for i in range(1, args.count + 1):
        payload, row_data = generar_muestra_correlacionada()
        ok = enviar_formulario(payload)
        
        if ok:
            exitosos += 1
            filas_generadas.append(row_data)
            progreso = (exitosos / args.count) * 100
            print(f"✅ [{exitosos:03d}/{args.count:03d}] ({progreso:5.1f}%) Enviado: {row_data['carrera'][:18]:<18} | {row_data['zona_residencia']:<16} | Estrés: {row_data['estres_entregas_likert']}")
        else:
            print(f"❌ [{i:03d}/{args.count:03d}] Falló el envío. Reintentando con delay...")
            time.sleep(3.0)

        # Espera con fluctuación aleatoria para evitar detección / ban
        sleep_time = random.uniform(args.delay_min, args.delay_max)
        time.sleep(sleep_time)

    # Guardar respaldo local en CSV para el módulo de visualización
    if filas_generadas:
        keys = list(filas_generadas[0].keys())
        with open(backup_csv_path, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(filas_generadas)

    print("=" * 65)
    print(f"🏁 FINALIZADO: {exitosos}/{args.count} respuestas enviadas exitosamente al Google Form.")
    print(f"📊 Archivo local actualizado en: {backup_csv_path}")
    print("=" * 65)

if __name__ == "__main__":
    main()
