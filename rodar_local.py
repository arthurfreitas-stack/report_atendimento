import csv
import requests
import time

API_KEY = "SUA_API_KEY_AQUI"  # substitua pela sua chave da Intercom

# COLOQUE O CAMINHO DO SEU CSV AQUI:
CSV_PATH = "contatos.csv"

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Intercom-Version": "2.11"
}

def buscar_contato(email):
    resp = requests.post(
        "https://api.intercom.io/contacts/search",
        headers=HEADERS,
        json={"query": {"field": "email", "operator": "=", "value": email}}
    )
    if resp.status_code == 200:
        return resp.json().get("data", [])
    return []

not_found = []
com_tag = []
sem_tag = []

with open(CSV_PATH, newline='', encoding='utf-8') as f:
    emails = [row["E-mail"].strip() for row in csv.DictReader(f) if row.get("E-mail")]

print(f"Total: {len(emails)} e-mails\n" + "=" * 60)

for i, email in enumerate(emails, 1):
    contacts = buscar_contato(email)

    if not contacts:
        not_found.append(email)
        print(f"[{i:03d}] NÃO ENCONTRADO | {email}")
    else:
        c = contacts[0]
        tag_ia = c.get("custom_attributes", {}).get("tag_ia")
        if tag_ia:
            com_tag.append(email)
            print(f"[{i:03d}] ✓ COM TAG_IA   | {email} → {tag_ia}")
        else:
            sem_tag.append(email)
            print(f"[{i:03d}] ✗ SEM TAG_IA   | {email}")

    time.sleep(0.2)

print(f"""
{'=' * 60}
RESUMO
Total processados : {len(emails)}
COM tag_ia        : {len(com_tag)}
SEM tag_ia        : {len(sem_tag)}
Não encontrados   : {len(not_found)}
""")

if sem_tag:
    print("--- SEM TAG_IA ---")
    for e in sem_tag:
        print(f"  {e}")

if not_found:
    print("--- NÃO ENCONTRADOS ---")
    for e in not_found:
        print(f"  {e}")
