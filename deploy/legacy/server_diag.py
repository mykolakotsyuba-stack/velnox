#!/usr/bin/env python3
"""SSH diagnostic script using paramiko"""
import sys

try:
    import paramiko
except ImportError:
    print("Installing paramiko...")
    import subprocess
    subprocess.run([sys.executable, "-m", "pip", "install", "paramiko", "-q"], check=True)
    import paramiko

import socket

HOST = "mail.irbis.ua"
USER = "user"
PASS = "12345678"

COMMANDS = [
    ("PROJECTS", "ls -la /srv/projects/ 2>/dev/null || echo 'NO /srv/projects'"),
    ("SYSTEMD", "systemctl list-units --type=service --state=active 2>/dev/null | grep -E 'irbis|velnox|nginx|php|postgres|streamlit' || echo 'none'"),
    ("PORTS", "ss -tlnp 2>/dev/null | grep LISTEN"),
    ("NGINX SITES", "ls -la /etc/nginx/sites-enabled/ 2>/dev/null || echo 'no sites'"),
    ("NGINX DEFAULT", "cat /etc/nginx/sites-enabled/default 2>/dev/null || echo 'no default'"),
    ("NGINX ALL", "cat /etc/nginx/sites-enabled/* 2>/dev/null || echo 'no configs'"),
    ("PHP VERSION", "php -v 2>/dev/null | head -1 || echo 'PHP not found'"),
    ("NODE VERSION", "node -v 2>/dev/null || echo 'Node not found'"),
    ("PYTHON VERSION", "python3 -v 2>/dev/null || python3 --version 2>/dev/null"),
    ("DISK USAGE", "df -h / 2>/dev/null | tail -1"),
    ("IRBIS STATUS", "systemctl status irbis-asana-dashboard 2>/dev/null | head -20 || echo 'Service not found'"),
]

def run_diag():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    print(f"Connecting to {HOST}...")
    try:
        client.connect(HOST, username=USER, password=PASS, timeout=20, allow_agent=False, look_for_keys=False)
        print("Connected!\n")
    except Exception as e:
        print(f"ERROR connecting: {e}")
        return

    for label, cmd in COMMANDS:
        print(f"\n{'='*20} {label} {'='*20}")
        try:
            stdin, stdout, stderr = client.exec_command(cmd, timeout=10)
            out = stdout.read().decode('utf-8', errors='replace').strip()
            err = stderr.read().decode('utf-8', errors='replace').strip()
            if out:
                print(out)
            if err:
                print(f"STDERR: {err[:300]}")
        except Exception as e:
            print(f"Command error: {e}")

    client.close()
    print("\n=== DIAGNOSTICS COMPLETE ===")

if __name__ == "__main__":
    run_diag()
