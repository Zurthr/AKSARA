import json
import requests
import os
import sys

def test_live_api():
    # 1. Simulate Frontend getting User History
    # In a real app, the Frontend tracks this or fetches it from the backend.
    # Here, we will read the 'live' db.json to get the latest clicks you generated.
    
    db_path = "../mock-backend/db.json"
    if not os.path.exists(db_path):
        print(f"Error: {db_path} not found.")
        return

    print(f"Reading live user history from {db_path}...")
    with open(db_path, 'r') as f:
        db_data = json.load(f)
        
    click_events = db_data.get('click_events', [])
    
    if not click_events:
        print("No click events found in db.json!")
        return

    # Let's take the last 5 events to simulate the recent session
    recent_events = click_events[-5:]
    
    # Payload
    payload = {
        "events": recent_events
    }
    
    print(f"\nSending {len(recent_events)} events to Recommendation Engine...")
    print("Events being sent:")
    for e in recent_events:
        print(f" - [{e.get('event_type')}] {e.get('item_title', 'Unknown Title')} (ID: {e.get('item_id')})")

    # 2. Call the API
    url = "http://localhost:8000/recommend"
    try:
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            print("\n✅ API RESPONSE (What Frontend Receives):")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"\n❌ API Error: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("\n❌ Could not connect to API.")
        print("Make sure you are running the server in a separate terminal:")
        print("uvicorn main_api:app --reload")

if __name__ == "__main__":
    test_live_api()
