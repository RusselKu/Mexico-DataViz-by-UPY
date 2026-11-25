#!/usr/bin/env python3
"""
Extractor de Capa Bronze (Datos Crudos Reales)
Proyecto: Mexico-DataViz-by-UPY (Equipo 3)
Estándar: DataGeo / Data Warehouse (Structured + Spatial Data Teams)

Descarga datos reales y verificables de fuentes públicas abiertas para los
9 módulos temáticos, preservando trazabilidad (URL, fecha ISO, licencia, tamaño).
"""

import json
import os
import sys
import time
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

import requests

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BRONZE_DIR = os.path.join("data", "bronze")
os.makedirs(BRONZE_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mexico-DataViz-by-UPY/2.0 (Universidad Politecnica de Yucatan; DW-ETL)"
}
OVERPASS_URLS = [
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://overpass-api.de/api/interpreter",
]

MANIFEST = []


def record_manifest(clave, modulo, filename, fuente, url, licencia, formato, responsable, notas=""):
    path = os.path.join(BRONZE_DIR, filename)
    size_bytes = os.path.getsize(path) if os.path.exists(path) else 0
    MANIFEST.append({
        "clave": clave,
        "modulo": modulo,
        "capa": "bronze",
        "archivo": f"data/bronze/{filename}",
        "formato": formato,
        "fuente": fuente,
        "url": url,
        "fecha_extraccion": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "licencia": licencia,
        "tamano_bytes": size_bytes,
        "responsable": responsable,
        "notas": notas,
    })


def overpass_query(ql: str, timeout: int = 90) -> dict:
    last_err = None
    for endpoint in OVERPASS_URLS:
        try:
            r = requests.post(
                endpoint,
                data={"data": ql},
                headers=HEADERS,
                timeout=timeout,
            )
            if r.status_code == 200:
                return r.json()
            last_err = f"HTTP {r.status_code}"
        except Exception as e:
            last_err = str(e)
    raise RuntimeError(f"Overpass failed on all endpoints: {last_err}")


def extract_01_salud_yucatan_osm():
    print("[01/09] Extrayendo establecimientos de salud reales de Yucatán (OpenStreetMap Overpass)...")
    # Bounding box de Yucatán: sur 19.55, oeste -90.45, norte 21.65, este -87.45
    ql = """
    [out:json][timeout:60];
    (
      node["amenity"~"^(hospital|clinic|doctors|pharmacy|dentist)$"](19.55,-90.45,21.65,-87.45);
      way["amenity"~"^(hospital|clinic|doctors|pharmacy|dentist)$"](19.55,-90.45,21.65,-87.45);
      node["healthcare"](19.55,-90.45,21.65,-87.45);
      way["healthcare"](19.55,-90.45,21.65,-87.45);
    );
    out center tags;
    """
    data = overpass_query(ql)
    out_file = "01_salud_yucatan_osm_raw.json"
    with open(os.path.join(BRONZE_DIR, out_file), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    n = len(data.get("elements", []))
    print(f"   -> OK: {n} establecimientos de salud extraídos.")
    record_manifest(
        "BRZ-01-SALUD-OSM", "01_inegi_denue", out_file,
        "OpenStreetMap Overpass API (Infraestructura de Salud Yucatán)",
        OVERPASS_URLS[0], "ODbL 1.0", "JSON", "Alejandra / Russel",
        f"{n} elementos georreferenciados en bbox Yucatán"
    )


def extract_02_dge_covid_mx():
    print("[02/09] Extrayendo series históricas reales DGE COVID-19 México / Yucatán...")
    base = "https://raw.githubusercontent.com/mariorz/covid19-mx-time-series/master/data"
    files = [
        ("BRZ-02-COVID-CONF", "covid19_confirmed_mx.csv", "02_dge_covid19_confirmed_mx_raw.csv", "Casos confirmados diarios DGE"),
        ("BRZ-02-COVID-DEF", "covid19_deaths_mx.csv", "02_dge_covid19_deaths_mx_raw.csv", "Defunciones diarias DGE"),
        ("BRZ-02-COVID-NEG", "covid19_negatives_mx.csv", "02_dge_covid19_negatives_mx_raw.csv", "Casos negativos diarios DGE"),
        ("BRZ-02-COVID-SUSP", "covid19_suspects_mx.csv", "02_dge_covid19_suspects_mx_raw.csv", "Casos sospechosos diarios DGE"),
    ]
    for clave, remote, local, desc in files:
        url = f"{base}/{remote}"
        r = requests.get(url, headers=HEADERS, timeout=30)
        r.raise_for_status()
        with open(os.path.join(BRONZE_DIR, local), "wb") as f:
            f.write(r.content)
        print(f"   -> OK: {local} ({len(r.content):,} B)")
        record_manifest(
            clave, "02_datos_gob", local,
            "Dirección General de Epidemiología (DGE) vía covid19-mx-time-series",
            url, "Datos Abiertos MX / MIT", "CSV", "Alejandra", desc
        )


def extract_03_municipios_yucatan_geojson():
    print("[03/09] Extrayendo polígonos oficiales INEGI de los 106 municipios de Yucatán...")
    url = "https://raw.githubusercontent.com/JuveCampos/Shapes_Resiliencia_CDMX_CIDE/master/geojsons/Division%20Politica/mpios2.geojson"
    r = requests.get(url, headers=HEADERS, timeout=60)
    r.raise_for_status()
    full_gj = r.json()
    yuc_features = []
    for feat in full_gj.get("features", []):
        props = feat.get("properties", {})
        cve_ent = str(props.get("CVE_ENT", props.get("CVEGEO", ""))).zfill(2)[:2]
        if cve_ent == "31":
            yuc_features.append(feat)
    yuc_gj = {
        "type": "FeatureCollection",
        "name": "inegi_yucatan_106_municipios",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": yuc_features,
    }
    out_file = "03_inegi_yucatan_106_municipios_raw.geojson"
    with open(os.path.join(BRONZE_DIR, out_file), "w", encoding="utf-8") as f:
        json.dump(yuc_gj, f, ensure_ascii=False)
    print(f"   -> OK: {len(yuc_features)} municipios de Yucatán extraídos.")
    record_manifest(
        "BRZ-03-MUN-YUC", "03_siegy_yucatan", out_file,
        "INEGI Marco Geoestadístico Municipal (filtrado CVE_ENT=31)",
        url, "Libre Uso INEGI", "GeoJSON", "Alejandra / Russel",
        f"{len(yuc_features)} polígonos municipales oficiales en EPSG:4326"
    )


def extract_04_merida_parques_y_comisarias():
    print("[04/09] Extrayendo parques y comisarías reales de Mérida (OpenStreetMap Overpass)...")
    # Bbox Municipio de Mérida: 20.72,-89.82,21.22,-89.45
    ql_parks = """
    [out:json][timeout:60];
    (
      node["leisure"="park"](20.72,-89.82,21.22,-89.45);
      way["leisure"="park"](20.72,-89.82,21.22,-89.45);
      relation["leisure"="park"](20.72,-89.82,21.22,-89.45);
    );
    out center tags;
    """
    parks = overpass_query(ql_parks)
    out_parks = "04_merida_parques_osm_raw.json"
    with open(os.path.join(BRONZE_DIR, out_parks), "w", encoding="utf-8") as f:
        json.dump(parks, f, ensure_ascii=False)
    np = len(parks.get("elements", []))
    print(f"   -> OK: {np} parques y áreas verdes de Mérida extraídos.")
    record_manifest(
        "BRZ-04-PARQUES-MID", "04_geoportal_merida", out_parks,
        "OpenStreetMap Overpass API (Parques y Espacios Públicos Mérida)",
        OVERPASS_URLS[0], "ODbL 1.0", "JSON", "Russel",
        f"{np} parques georreferenciados en Mérida"
    )

    time.sleep(2)
    ql_places = """
    [out:json][timeout:60];
    (
      node["place"~"^(suburb|village|hamlet|town|neighbourhood)$"](20.72,-89.82,21.22,-89.45);
    );
    out body;
    """
    places = overpass_query(ql_places)
    out_places = "04_merida_comisarias_osm_raw.json"
    with open(os.path.join(BRONZE_DIR, out_places), "w", encoding="utf-8") as f:
        json.dump(places, f, ensure_ascii=False)
    nl = len(places.get("elements", []))
    print(f"   -> OK: {nl} localidades, colonias y comisarías de Mérida extraídas.")
    record_manifest(
        "BRZ-04-LOCALIDADES-MID", "04_geoportal_merida", out_places,
        "OpenStreetMap Overpass API (Comisarías y Localidades Mérida)",
        OVERPASS_URLS[0], "ODbL 1.0", "JSON", "Russel",
        f"{nl} localidades/comisarías/colonias en Mérida"
    )


def extract_06_prensa_yucatan_rss():
    print("[06/09] Scrapeando corpus real de prensa regional de Yucatán (Google News RSS)...")
    queries = [
        ("vacunacion_yucatan", "vacunación salud Yucatán Mérida"),
        ("hospitales_merida", "hospital O'Horán IMSS ISSSTE Mérida Yucatán"),
        ("upy_universidad", "Universidad Politécnica de Yucatán UPY Mérida"),
        ("comisarias_merida", "comisarías salud parques Mérida Yucatán"),
        ("resiliencia_yucatan", "salud pública epidemiología Yucatán municipios"),
    ]
    all_items = []
    seen_links = set()
    for topic, q in queries:
        encoded_q = urllib.parse.quote(q)
        url = f"https://news.google.com/rss/search?q={encoded_q}&hl=es-419&gl=MX&ceid=MX:es-419"
        r = requests.get(url, headers=HEADERS, timeout=20)
        r.raise_for_status()
        root = ET.fromstring(r.content)
        count_topic = 0
        for item in root.findall("./channel/item"):
            title = (item.findtext("title") or "").strip()
            link = (item.findtext("link") or "").strip()
            pub_date = (item.findtext("pubDate") or "").strip()
            source_el = item.find("source")
            source = source_el.text.strip() if source_el is not None and source_el.text else "Prensa Regional"
            if link and link not in seen_links:
                seen_links.add(link)
                all_items.append({
                    "topic_query": topic,
                    "medio": source,
                    "titular": title,
                    "fecha_pub_raw": pub_date,
                    "url": link,
                })
                count_topic += 1
        print(f"   -> Tópico '{topic}': {count_topic} artículos reales")
        time.sleep(0.5)

    out_file = "06_prensa_yucatan_rss_raw.json"
    with open(os.path.join(BRONZE_DIR, out_file), "w", encoding="utf-8") as f:
        json.dump(all_items, f, indent=2, ensure_ascii=False)
    print(f"   -> OK: {len(all_items)} artículos únicos reales scrapeados.")
    record_manifest(
        "BRZ-06-PRENSA-RSS", "06_web_scraping", out_file,
        "Google News RSS (Prensa Regional Yucatán: Diario de Yucatán, Por Esto!, La Jornada Maya, SSY)",
        "https://news.google.com/rss/search?hl=es-419&gl=MX&ceid=MX:es-419",
        "Uso Académico / Metadatos Públicos RSS", "JSON", "Russel",
        f"{len(all_items)} titulares únicos con fecha y URL"
    )


def extract_07_encuesta_upy_live():
    print("[07/09] Sincronizando respuestas en vivo de la Encuesta Estudiantil UPY (Google Sheets)...")
    url = "https://docs.google.com/spreadsheets/d/1gHGz2dC0Heto2PDakjI2Vagj29jATsoPkdIdazUZaB8/export?format=csv"
    r = requests.get(url, headers=HEADERS, timeout=20)
    r.raise_for_status()
    out_file = "07_encuesta_upy_google_sheets_raw.csv"
    with open(os.path.join(BRONZE_DIR, out_file), "wb") as f:
        f.write(r.content)
    lines = r.content.decode("utf-8", errors="replace").splitlines()
    print(f"   -> OK: {max(0, len(lines)-1)} respuestas reales sincronizadas ({len(r.content):,} B).")
    record_manifest(
        "BRZ-07-ENCUESTA-UPY", "07_self_produced_upy", out_file,
        "Levantamiento Propio Comunidad UPY (Google Forms / Google Sheets)",
        url, "CC-BY 4.0 (Self-Produced UPY)", "CSV", "Russel",
        f"{max(0, len(lines)-1)} registros reales de encuesta estudiantil"
    )


def extract_08_dem_merida_elevation():
    print("[08/09] Extrayendo matriz altimétrica real DEM de Mérida (Open-Meteo Copernicus DEM 90m)...")
    # Malla 20x20 = 400 puntos reales cubriendo Mérida y Campus UPY (20.88 a 21.08 N, -89.77 a -89.53 W)
    rows, cols = 20, 20
    lat_min, lat_max = 20.88, 21.08
    lon_min, lon_max = -89.77, -89.53
    lats = [round(lat_min + i * (lat_max - lat_min) / (rows - 1), 5) for i in range(rows)]
    lons = [round(lon_min + j * (lon_max - lon_min) / (cols - 1), 5) for j in range(cols)]

    grid_points = [(lat, lon, i, j) for i, lat in enumerate(lats) for j, lon in enumerate(lons)]
    elevations = []
    batch_size = 100
    for k in range(0, len(grid_points), batch_size):
        batch = grid_points[k:k + batch_size]
        lat_str = ",".join(str(p[0]) for p in batch)
        lon_str = ",".join(str(p[1]) for p in batch)
        url = f"https://api.open-meteo.com/v1/elevation?latitude={lat_str}&longitude={lon_str}"
        r = requests.get(url, headers=HEADERS, timeout=20)
        r.raise_for_status()
        vals = r.json().get("elevation", [])
        for p, elev in zip(batch, vals):
            elevations.append({
                "row": p[2],
                "col": p[3],
                "latitud": p[0],
                "longitud": p[1],
                "elevacion_msnm": elev,
            })
        time.sleep(0.25)

    payload = {
        "source": "Open-Meteo Elevation API (Copernicus DEM GLO-90)",
        "crs": "EPSG:4326",
        "vertical_datum": "EGM96 / MSL (metros)",
        "grid_shape": [rows, cols],
        "bounds": {"min_lat": lat_min, "max_lat": lat_max, "min_lon": lon_min, "max_lon": lon_max},
        "extraction_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "points": elevations,
    }
    out_file = "08_dem_merida_open_meteo_raw.json"
    with open(os.path.join(BRONZE_DIR, out_file), "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)
    print(f"   -> OK: {len(elevations)} puntos altimétricos reales de Mérida extraídos.")
    record_manifest(
        "BRZ-08-DEM-MERIDA", "08_lidar_3d", out_file,
        "Open-Meteo Elevation API (Copernicus DEM 90m)",
        "https://api.open-meteo.com/v1/elevation",
        "Copernicus DEM License / CC-BY 4.0", "JSON", "Daniel / Russel",
        f"Malla 20x20 ({len(elevations)} puntos) sobre Zona Metropolitana de Mérida y UPY"
    )


def extract_09_rcsb_pdb_6vxx():
    print("[09/09] Extrayendo metadatos y cabecera oficial RCSB Protein Data Bank (6VXX)...")
    url_meta = "https://data.rcsb.org/rest/v1/core/entry/6VXX"
    r1 = requests.get(url_meta, headers=HEADERS, timeout=20)
    r1.raise_for_status()
    out_meta = "09_rcsb_pdb_6vxx_entry_raw.json"
    with open(os.path.join(BRONZE_DIR, out_meta), "wb") as f:
        f.write(r1.content)
    record_manifest(
        "BRZ-09-PDB-META", "09_realidad_aumentada_ar", out_meta,
        "RCSB Protein Data Bank REST API (Entry 6VXX - SARS-CoV-2 Spike)",
        url_meta, "CC0 1.0 Public Domain", "JSON", "Daniel",
        "Metadatos cristalográficos/cryo-EM oficiales de 6VXX"
    )

    url_hdr = "https://files.rcsb.org/header/6VXX.pdb"
    r2 = requests.get(url_hdr, headers=HEADERS, timeout=20)
    r2.raise_for_status()
    out_hdr = "09_rcsb_pdb_6vxx_header_raw.pdb"
    with open(os.path.join(BRONZE_DIR, out_hdr), "wb") as f:
        f.write(r2.content)
    print(f"   -> OK: 6VXX JSON ({len(r1.content):,} B) + Header PDB ({len(r2.content):,} B).")
    record_manifest(
        "BRZ-09-PDB-HEADER", "09_realidad_aumentada_ar", out_hdr,
        "RCSB Protein Data Bank (Header 6VXX.pdb)",
        url_hdr, "CC0 1.0 Public Domain", "PDB", "Daniel",
        "Cabecera estructural oficial PDB 6VXX (resolución 2.8 A)"
    )


def main():
    print("=" * 72)
    print("INICIANDO EXTRACCIÓN CAPA BRONZE (DATOS REALES) - MEXICO-DATAVIZ-BY-UPY")
    print("=" * 72)
    extract_01_salud_yucatan_osm()
    extract_02_dge_covid_mx()
    extract_03_municipios_yucatan_geojson()
    extract_04_merida_parques_y_comisarias()
    extract_06_prensa_yucatan_rss()
    extract_07_encuesta_upy_live()
    extract_08_dem_merida_elevation()
    extract_09_rcsb_pdb_6vxx()

    manifest_path = os.path.join(BRONZE_DIR, "extraction_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(MANIFEST, f, indent=2, ensure_ascii=False)
    print("=" * 72)
    print(f"EXTRACCIÓN COMPLETADA: {len(MANIFEST)} activos reales en {BRONZE_DIR}")
    print(f"Manifiesto guardado en: {manifest_path}")
    print("=" * 72)


if __name__ == "__main__":
    main()
