import json
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

class TheBrain:
    def __init__(self, data_dir="../mock-backend/data"):
        self.data_dir = data_dir
        self.df = None
        self.tfidf_matrix = None
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.load_and_process_data()

    def load_json(self, filename):
        path = os.path.join(self.data_dir, filename)
        if not os.path.exists(path):
            print(f"Warning: {path} not found.")
            return []
        with open(path, 'r') as f:
            return json.load(f)

    def extract_tags(self, item, source_type):
        tags = item.get('tags', [])
        tag_strings = []
        
        if source_type == 'book':
            # Books: tags is list of dicts with 'name'
            tag_strings = [t.get('name', '') for t in tags]
        elif source_type == 'post':
            # Posts: tags is list of dicts with 'label'
            tag_strings = [t.get('label', '') for t in tags]
        elif source_type in ['event', 'community']:
            # Events/Communities: tags is list of strings
            tag_strings = tags
            
        # Clean and join
        return " ".join([str(t).replace('#', '') for t in tag_strings])

    def load_and_process_data(self):
        inventory = []

        # 1. Books
        books = self.load_json('books.json')
        for item in books:
            inventory.append({
                'id': item['id'],
                'title': item['title'],
                'type': 'book',
                'tags_str': self.extract_tags(item, 'book')
            })

        # 2. Events
        events = self.load_json('events.json')
        for item in events:
            inventory.append({
                'id': item['id'],
                'title': item['title'],
                'type': 'event',
                'tags_str': self.extract_tags(item, 'event')
            })

        # 3. Posts
        posts = self.load_json('posts.json')
        for item in posts:
            inventory.append({
                'id': item['id'],
                'title': item.get('title', ''), # Posts might not have title? (They do in sample)
                'type': 'post',
                'tags_str': self.extract_tags(item, 'post')
            })
            
        # 4. Communities
        communities = self.load_json('communities.json')
        for item in communities:
            inventory.append({
                'id': item['id'],
                'title': item['name'], # Communities use 'name'
                'type': 'community',
                'tags_str': self.extract_tags(item, 'community')
            })

        self.df = pd.DataFrame(inventory)
        
        # Create Content Soup: Title + Tags
        if not self.df.empty:
            self.df['content_soup'] = self.df['title'] + " " + self.df['tags_str']
            self.df['content_soup'] = self.df['content_soup'].fillna('')
            
            # Vectorize
            self.tfidf_matrix = self.vectorizer.fit_transform(self.df['content_soup'])
            print(f"The Brain initialized. Inventory size: {len(self.df)}")
        else:
            print("Warning: Inventory is empty.")

    def get_item_tags(self, item_id, item_type):
        """Retrieve tags string for a specific item"""
        item = self.df[(self.df['id'] == item_id) & (self.df['type'] == item_type)]
        if not item.empty:
            return item.iloc[0]['tags_str']
        return ""

    def build_user_vector(self, click_events):
        """
        Construct a weighted user query string based on interaction history.
        Weights:
        - view: 1
        - post_click, book_click: 3
        - community_click, join_event: 5
        """
        user_query_parts = []
        
        weights = {
            'view': 1,
            'post_click': 3, 
            'book_click': 3,
            'community_click': 5,
            'join_event': 5
        }
        
        # If unknown event type, default to 1
        
        for event in click_events:
            e_type = event.get('event_type')
            item_id = event.get('item_id')
            item_type = event.get('item_type') # Expected field
            
            # Infer item_type if missing (heuristic based on usage)
            if not item_type:
                 # Try to infer or skip? Better to skip if ambiguous, or try all?
                 # ideally frontend sends item_type. 
                 pass

            weight = weights.get(e_type, 1)
            
            tags = self.get_item_tags(item_id, item_type)
            if tags:
                # Repeat tags weight times
                user_query_parts.extend([tags] * weight)
                
        return " ".join(user_query_parts)

    def get_recommendations(self, click_events, top_n=5):
        if self.df is None or self.df.empty:
            return []

        user_query = self.build_user_vector(click_events)
        
        # If user has no history or valid tags found, return trending/random (or empty)
        # For this task, we'll just handle the vectorization.
        if not user_query.strip():
            # Fallback: return top random items if cold start? 
            # Or just return empty list as strict interpretation.
            # Let's return sample items to show something works.
            return self.df.head(top_n).to_dict('records')

        user_vec = self.vectorizer.transform([user_query])
        
        # Cosine Similarity
        cosine_sim = cosine_similarity(user_vec, self.tfidf_matrix).flatten()
        
        # Get indices sorted by score descending
        sim_indices = cosine_sim.argsort()[::-1]
        
        recommendations = []
        
        # Filter out items user already interacted with
        interacted_ids = set((e.get('item_id'), e.get('item_type')) for e in click_events)
        
        for idx in sim_indices:
            item = self.df.iloc[idx]
            if (item['id'], item['type']) not in interacted_ids:
                rec_item = item.to_dict()
                rec_item['score'] = float(cosine_sim[idx])
                # Remove internal soup columns for cleaner output
                del rec_item['content_soup']
                del rec_item['tags_str']
                recommendations.append(rec_item)
                
                if len(recommendations) >= top_n:
                    break
                    
        return recommendations
