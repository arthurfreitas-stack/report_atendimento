import csv
import os
import requests
import time

API_KEY = os.environ.get("INTERCOM_API_KEY", "")
if not API_KEY:
    raise SystemExit("Defina a variável de ambiente INTERCOM_API_KEY antes de executar.")

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Intercom-Version": "2.11"
}

CSV_PATH = "/root/.claude/uploads/16c1628e-8bd9-4bc2-9c13-435ab7c01014/e282855e-Planilha_sem_t_tulo__hubspotcrmexportscrmbaseticketacimader520260521.csv"

def search_contact_by_email(email):
    url = "https://api.intercom.io/contacts/search"
    payload = {
        "query": {
            "field": "email",
            "operator": "=",
            "value": email
        }
    }
    resp = requests.post(url, headers=HEADERS, json=payload)
    if resp.status_code == 200:
        data = resp.json()
        contacts = data.get("data", [])
        return contacts
    else:
        return None, resp.status_code, resp.text

results = []
not_found = []
found_with_tag = []
found_without_tag = []
errors = []

with open(CSV_PATH, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    emails = [row["E-mail"].strip() for row in reader if row.get("E-mail")]

print(f"Total de e-mails no CSV: {len(emails)}\n")
print("=" * 70)

for i, email in enumerate(emails, 1):
    contacts = search_contact_by_email(email)

    if contacts is None:
        errors.append(email)
        print(f"[{i:03d}] ERRO       | {email}")
        time.sleep(0.3)
        continue

    if isinstance(contacts, tuple):
        _, status, text = contacts
        errors.append(email)
        print(f"[{i:03d}] ERRO {status}  | {email} → {text[:80]}")
        time.sleep(0.3)
        continue

    if len(contacts) == 0:
        not_found.append(email)
        print(f"[{i:03d}] NÃO ENCONTRADO | {email}")
    else:
        contact = contacts[0]
        contact_id = contact.get("id")
        custom_attrs = contact.get("custom_attributes", {})
        tag_ia = custom_attrs.get("tag_ia")

        if tag_ia:
            found_with_tag.append({"email": email, "id": contact_id, "tag_ia": tag_ia})
            print(f"[{i:03d}] ✓ COM TAG_IA   | {email} | id={contact_id} | tag_ia={tag_ia}")
        else:
            found_without_tag.append({"email": email, "id": contact_id})
            print(f"[{i:03d}] ✗ SEM TAG_IA   | {email} | id={contact_id}")

    time.sleep(0.2)

print("\n" + "=" * 70)
print("RESUMO FINAL")
print("=" * 70)
print(f"Total e-mails processados : {len(emails)}")
print(f"Não encontrados na Intercom: {len(not_found)}")
print(f"Encontrados COM tag_ia     : {len(found_with_tag)}")
print(f"Encontrados SEM tag_ia     : {len(found_without_tag)}")
print(f"Erros de API               : {len(errors)}")

if not_found:
    print("\n--- E-MAILS NÃO ENCONTRADOS NA INTERCOM ---")
    for e in not_found:
        print(f"  {e}")

if found_without_tag:
    print("\n--- CONTATOS SEM tag_ia ---")
    for c in found_without_tag:
        print(f"  {c['email']} | id={c['id']}")

if errors:
    print("\n--- ERROS ---")
    for e in errors:
        print(f"  {e}")
