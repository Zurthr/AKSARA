from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Union, Any
import uvicorn
import os
import sys

# Ensure current directory is in path to import local modules if needed
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from the_brain import TheBrain

app = FastAPI(title="AKSARA Recommendation Engine")

# Global instance
brain = None

class ClickEvent(BaseModel):
    event_type: str
    item_id: Union[int, str]
    item_type: Optional[str] = None # 'book', 'event', 'post', 'community'
    timestamp: Optional[str] = None

class RecommendationRequest(BaseModel):
    events: List[ClickEvent]

@app.on_event("startup")
def startup_event():
    global brain
    # Adjust path if running from a different directory, but default relative path assumes
    # we are running 'python main_api.py' or 'uvicorn main_api:app' from 'aksara-engine' folder.
    # The data is in ../mock-backend/data
    data_path = os.path.join("..", "mock-backend", "data")
    
    # Check if we need to adjust based on where the process is stored
    if not os.path.exists(data_path):
         # Fallback for different CWD
         data_path = os.path.join(os.getcwd(), "..", "mock-backend", "data")
         
    print(f"Loading data from: {data_path}")
    brain = TheBrain(data_dir=data_path)

@app.get("/")
def read_root():
    return {"status": "online", "message": "AKSARA Engine is running"}

@app.post("/recommend")
def get_recommendations(request: RecommendationRequest):
    if not brain:
        raise HTTPException(status_code=500, detail="Engine not initialized")
    
    # Convert Pydantic models to dicts for internal processing
    events_data = [e.dict() for e in request.events]
    
    try:
        recommendations = brain.get_recommendations(events_data)
        return {"recommendations": recommendations}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main_api:app", host="0.0.0.0", port=8000, reload=True)
