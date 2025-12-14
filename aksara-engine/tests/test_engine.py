import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

from the_brain import TheBrain

def test_logic():
    print("Initializing Brain...")
    # Assuming we are running this from inside aksara-engine/
    # Data path should be ../mock-backend/data
    data_path = "../mock-backend/data"
    
    if not os.path.exists(data_path):
        print(f"Data path {data_path} not found. Trying absolute path...")
        data_path = os.path.join(os.getcwd(), "..", "mock-backend", "data")
        
    brain = TheBrain(data_dir=data_path)
    
    if brain.df is None or brain.df.empty:
        print("FAIL: DataFrame is empty")
        return

    print("Inventory loaded. Size:", len(brain.df))

    def print_event_details(events, test_num):
        print(f"\nTest {test_num}:")
        for e in events:
            # Lookup item in brain.df
            # Note: df['id'] might be mixed types, ensure we match correctly
            # We convert both to string for safety in comparison if needed, or rely on exact match
            item_id = e['item_id']
            item_type = e['item_type']
            
            # Find matching row
            item = brain.df[(brain.df['id'] == item_id) & (brain.df['type'] == item_type)]
            
            if not item.empty:
                title = item.iloc[0]['title']
            else:
                title = "Unknown Item"
                
            print(f"  User {e['event_type']} -> [{item_type}] {title} (ID: {item_id})")

    # Test Case 1
    events1 = [
        {
            "event_type": "book_click",
            "item_id": 3, 
            "item_type": "book"
        }
    ]
    
    print_event_details(events1, 1)
    recs = brain.get_recommendations(events1, top_n=3)
    for i, item in enumerate(recs):
        print(f"    {i+1}. [{item['type']}] {item['title']} (Score: {item['score']:.4f})")
    
    # Test Case 2
    events2 = [
        {
            "event_type": "view",
            "item_id": 1, 
            "item_type": "book"
        }
    ]
    
    print_event_details(events2, 2)
    recs2 = brain.get_recommendations(events2, top_n=3)
    for i, item in enumerate(recs2):
        print(f"    {i+1}. [{item['type']}] {item['title']} (Score: {item['score']:.4f})")

if __name__ == "__main__":
    test_logic()
