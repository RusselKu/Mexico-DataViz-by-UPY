#!/usr/bin/env python3
"""
Scraper Real de Prensa Regional de Yucatán (RSS / Metadatos Públicos)
Proyecto: Mexico-DataViz-by-UPY
Vista: 06 - Web Scraping (Voz de la Prensa y Resiliencia Comunitaria)
Responsable: Russel (Russelsin)

Extrae artículos reales y vigentes de medios regionales de Yucatán
(Diario de Yucatán, Por Esto!, La Jornada Maya, SSY, entre otros)
mediante feeds RSS, extrayendo palabras clave y puntaje de polaridad léxica.
"""

import csv
import json
import os
import re
import sys
import time
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

import requests

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HEADERS = {
    "User-Agent": "Mexico-DataViz-by-UPY/2.0 (Academic Press Scraper)"
}

QUERIES = [
    ("vacunacion_yucatan", "vacunación salud Yucatán Mérida"),
    ("hospitales_merida", "hospital O'Horán IMSS ISSSTE Mérida Yucatán"),
    ("upy_universidad", "Universidad Politécnica de Yucatán UPY Mérida"),
    ("comisarias_merida", "comisarías salud parques Mérida Yucatán"),
    ("resiliencia_yucatan", "salud pública epidemiología Yucatán municipios"),
]

POS_WORDS = {
    "éxito", "exito", "avance", "avanza", "mejora", "solidaridad", "resiliencia",
    "vacunación", "vacunacion", "salud", "inversión", "inversion", "nuevo", "nueva",
    "apoyo", "beneficio", "seguro", "segura", "calidad", "gratuito", "gratuita",
    "reconocimiento", "impulso", "modernización", "fortalece", "crece", "logro",
    "innovación", "innovacion", "prevención", "prevencion", "cobertura", "recuperación",
}

NEG_WORDS = {
    "crisis", "alerta", "riesgo", "muerte", "fallece", "brote", "saturación",
    "saturacion", "falta", "desabasto", "protesta", "denuncia", "emergencia",
    "grave", "aumento", "contagio", "contagios", "hospitalizado", "deficiencia",
    "problema", "accidente", "rechazo", "rezago", "demora", "queja",
}

DOMAIN_KEYWORDS = [
    "vacunación", "vacuna", "salud", "hospital", "o'horán", "imss", "issste",
    "mérida", "yucatán", "upy", "universidad", "estudiantes", "comisarías",
    "parques", "clínica", "médicos", "prevención", "dengue", "covid",
    "municipios", "infraestructura", "educación", "comunidad", "tecnología",
]


def analizar_texto(titular: str):
    txt = titular.lower()
    tokens = re.findall(r"[a-záéíóúñü']+", txt)
    pos = sum(1 for t in tokens if t in POS_WORDS)
    neg = sum(1 for t in tokens if t in NEG_WORDS)
    if pos + neg == 0:
        polaridad = 0.05
    else:
        polaridad = round((pos - neg) / (pos + neg), 3)
    sentimiento = "positivo" if polaridad > 0.1 else ("negativo" if polaridad < -0.1 else "neutro")
    kws = [kw for kw in DOMAIN_KEYWORDS if kw in txt]
    if not kws:
        kws = ["yucatán", "salud pública"]
    return kws, polaridad, sentimiento


def parse_iso_date(pub_raw: str) -> str:
    try:
        dt = parsedate_to_datetime(pub_raw)
        return dt.strftime("%Y-%m-%d")
    except Exception:
        return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def scrape_prensa():
    output_dir = os.path.join("data", "06_web_scraping", "01_fuente_origen_scraped_press")
    os.makedirs(output_dir, exist_ok=True)

    articulos = []
    seen = set()
    idx = 1

    for topic, q in QUERIES:
        url = f"https://news.google.com/rss/search?q={urllib.parse.quote(q)}&hl=es-419&gl=MX&ceid=MX:es-419"
        r = requests.get(url, headers=HEADERS, timeout=20)
        r.raise_for_status()
        root = ET.fromstring(r.content)
        for item in root.findall("./channel/item"):
            title = (item.findtext("title") or "").strip()
            link = (item.findtext("link") or "").strip()
            pub_raw = (item.findtext("pubDate") or "").strip()
            source_el = item.find("source")
            medio = source_el.text.strip() if source_el is not None and source_el.text else "Prensa Regional"
            if not link or link in seen:
                continue
            seen.add(link)
            kws, polaridad, sentimiento = analizar_texto(title)
            articulos.append({
                "id_articulo": f"NOT-YUC-{idx:04d}",
                "topico": topic,
                "medio": medio,
                "fecha": parse_iso_date(pub_raw),
                "titular": title,
                "keywords": kws,
                "polaridad": polaridad,
                "sentimiento": sentimiento,
                "url": link,
                "cve_ent": "31",
                "cve_mun": "050" if "mérida" in title.lower() or "merida" in title.lower() else "000",
            })
            idx += 1
        time.sleep(0.4)

    json_path = os.path.join(output_dir, "corpus_noticias_prensa_yucatan.json")
    csv_path = os.path.join(output_dir, "corpus_noticias_prensa_yucatan.csv")

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(articulos, f, indent=2, ensure_ascii=False)

    fieldnames = [
        "id_articulo", "topico", "medio", "fecha", "titular",
        "keywords", "polaridad", "sentimiento", "cve_ent", "cve_mun", "url"
    ]
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for art in articulos:
            row = art.copy()
            row["keywords"] = "; ".join(row["keywords"])
            writer.writerow(row)

    print(f"OK: {len(articulos)} artículos reales exportados a {csv_path} y {json_path}")


if __name__ == "__main__":
    scrape_prensa()
