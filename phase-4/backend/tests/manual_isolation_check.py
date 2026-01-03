import requests
import sys

BASE_URL = "http://localhost:8000/api"

def run_check():
    # 1. Signup User A
    user_a = f"user_a_{uuid.uuid4()}@example.com"
    pwd = "password123"
    print(f"Creating User A: {user_a}")
    res = requests.post(f"{BASE_URL}/auth/signup", json={"email": user_a, "password": pwd})
    if res.status_code != 200:
        print("Failed to signup User A")
        return
    token_a = res.json()["access_token"]

    # 2. Create Task A
    headers_a = {"Authorization": f"Bearer {token_a}"}
    print("User A creating task...")
    res = requests.post(f"{BASE_URL}/tasks/", json={"title": "Secret Task A"}, headers=headers_a)
    if res.status_code != 200:
        print("Failed to create task")
        return
    task_a_id = res.json()["id"]
    print(f"Task A ID: {task_a_id}")

    # 3. Signup User B
    user_b = f"user_b_{uuid.uuid4()}@example.com"
    print(f"Creating User B: {user_b}")
    res = requests.post(f"{BASE_URL}/auth/signup", json={"email": user_b, "password": pwd})
    token_b = res.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 4. Try to GET Task A with User B token
    print("User B attempting to access Task A...")
    res = requests.get(f"{BASE_URL}/tasks/{task_a_id}", headers=headers_b)
    
    if res.status_code == 404:
        print("SUCCESS: Access denied (404 Not Found)")
    elif res.status_code == 403:
        print("SUCCESS: Access denied (403 Forbidden)")
    else:
        print(f"FAILURE: User B accessed Task A! Status: {res.status_code}")
        print(res.json())

if __name__ == "__main__":
    import uuid
    try:
        run_check()
    except Exception as e:
        print(f"Error: {e}")
        print("Ensure server is running at localhost:8000")
