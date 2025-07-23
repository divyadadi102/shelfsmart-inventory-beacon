#!/usr/bin/env python3
"""
item_mapper.py

ItemMapper class for enriching sales predictions with readable item names,
category information, and generating chart data for visualization.

Features:
- Maps item numbers to readable names
- Enriches category information  
- Creates chart data for frontend visualization
- Handles missing item information gracefully
- Learns from user's CSV data containing item_name column
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
import json
import os

class ItemMapper:
    """
    Maps item numbers and categories to human-readable names
    and generates chart data for visualization
    """
    
    def __init__(self, mapping_file: Optional[str] = None):
        """
        Initialize ItemMapper
        
        Args:
            mapping_file (str, optional): Path to JSON file containing item mappings
        """
        self.item_mappings = {}
        self.category_mappings = {}
        self.class_mappings = {}
        
        # Load mappings if file provided
        if mapping_file and os.path.exists(mapping_file):
            self.load_mappings(mapping_file)
        else:
            # Initialize with default mappings
            self._initialize_default_mappings()
    
    def _initialize_default_mappings(self):
        """Initialize with common item and category mappings"""
        
        # Category mappings (common grocery categories)
        self.category_mappings = {
            'AUTOMOTIVE': 'Automotive & Car Care',
            'BABY CARE': 'Baby Care & Products',
            'BEAUTY': 'Beauty & Personal Care',
            'BEVERAGES': 'Beverages & Drinks',
            'BOOKS': 'Books & Media',
            'BREAD/BAKERY': 'Bread & Bakery',
            'CELEBRATION': 'Party & Celebration',
            'CLEANING': 'Cleaning Supplies',
            'DAIRY': 'Dairy Products',
            'DELI': 'Deli & Prepared Foods',
            'EGGS': 'Eggs',
            'FROZEN FOODS': 'Frozen Foods',
            'GROCERY I': 'Grocery - Packaged Foods',
            'GROCERY II': 'Grocery - Canned & Dry Goods',
            'HARDWARE': 'Hardware & Tools',
            'HOME AND GARDEN I': 'Home & Garden',
            'HOME AND GARDEN II': 'Garden & Outdoor',
            'HOME APPLIANCES': 'Home Appliances',
            'HOME CARE': 'Home Care Products',
            'LADIESWEAR': 'Ladies Clothing',
            'LAWN AND GARDEN': 'Lawn & Garden',
            'LINGERIE': 'Lingerie',
            'LIQUOR,WINE,BEER': 'Alcohol & Beverages',
            'MAGAZINES': 'Magazines',
            'MEATS': 'Fresh Meat',
            'PERSONAL CARE': 'Personal Care',
            'PET SUPPLIES': 'Pet Supplies',
            'PLAYERS AND ELECTRONICS': 'Electronics',
            'POULTRY': 'Poultry',
            'PREPARED FOODS': 'Prepared Foods',
            'PRODUCE': 'Fresh Produce',
            'SCHOOL AND OFFICE SUPPLIES': 'Office Supplies',
            'SEAFOOD': 'Fresh Seafood'
        }
        
        # Item class mappings (sample common classes)
        self.class_mappings = {
            1096: 'Packaged Snacks',
            1097: 'Canned Goods',
            1098: 'Condiments & Sauces',
            1099: 'Rice & Grains',
            1100: 'Pasta & Noodles',
            1101: 'Cooking Oil & Vinegar',
            1102: 'Spices & Seasonings',
            1103: 'Baking Supplies',
            1104: 'Breakfast Cereals',
            1105: 'Coffee & Tea',
            3024: 'Household Cleaners',
            3025: 'Laundry Detergent',
            3026: 'Dish Soap',
            3027: 'Paper Towels',
            3028: 'Toilet Paper',
            3029: 'Trash Bags',
            3030: 'Air Fresheners',
            2001: 'Fresh Vegetables',
            2002: 'Fresh Fruits',
            2003: 'Herbs & Greens',
            2004: 'Organic Produce',
            4001: 'Ground Beef',
            4002: 'Chicken Breast',
            4003: 'Pork Chops',
            4004: 'Fish Fillets',
            4005: 'Deli Meats',
            5001: 'Milk',
            5002: 'Cheese',
            5003: 'Yogurt',
            5004: 'Butter',
            5005: 'Ice Cream'
        }
        
        # Sample item mappings (common items by item_nbr)
        self.item_mappings = {
            108952: 'Multi-Surface Cleaner',
            402175: 'Premium Breakfast Cereal',
            123456: 'Organic Bananas',
            234567: 'Whole Milk (1 Gallon)',
            345678: 'Ground Coffee (12oz)',
            456789: 'Chicken Breast (Family Pack)',
            567890: 'White Bread (Loaf)',
            678901: 'Large Eggs (Dozen)',
            789012: 'Cheddar Cheese (8oz)',
            890123: 'Pasta Sauce (24oz)',
            901234: 'Orange Juice (64oz)',
            112233: 'Toilet Paper (12 Roll)',
            223344: 'Paper Towels (6 Roll)',
            334455: 'Laundry Detergent (32oz)',
            445566: 'Dish Soap (22oz)',
            556677: 'All-Purpose Flour (5lb)',
            667788: 'Vegetable Oil (48oz)',
            778899: 'Brown Rice (2lb)',
            889900: 'Black Beans (15oz Can)',
            990011: 'Tomato Sauce (15oz Can)'
        }
    
    def load_mappings(self, mapping_file: str):
        """
        Load item mappings from JSON file
        
        Args:
            mapping_file (str): Path to JSON mapping file
        """
        try:
            with open(mapping_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.item_mappings = data.get('items', {})
            self.category_mappings = data.get('categories', {})
            self.class_mappings = data.get('classes', {})
            
            # Convert string keys to integers for item_nbr and item_class
            if self.item_mappings:
                self.item_mappings = {int(k): v for k, v in self.item_mappings.items()}
            if self.class_mappings:
                self.class_mappings = {int(k): v for k, v in self.class_mappings.items()}
            
            print(f"✅ Loaded mappings from {mapping_file}")
            print(f"   📦 Items: {len(self.item_mappings)}")
            print(f"   📂 Categories: {len(self.category_mappings)}")
            print(f"   🏷️ Classes: {len(self.class_mappings)}")
            
        except Exception as e:
            print(f"⚠️ Failed to load mappings from {mapping_file}: {e}")
            print("   Using default mappings instead")
            self._initialize_default_mappings()
    
    def save_mappings(self, mapping_file: str):
        """
        Save current mappings to JSON file
        
        Args:
            mapping_file (str): Path to save JSON mapping file
        """
        try:
            data = {
                'items': {str(k): v for k, v in self.item_mappings.items()},
                'categories': self.category_mappings,
                'classes': {str(k): v for k, v in self.class_mappings.items()},
                'generated_at': pd.Timestamp.now().isoformat(),
                'version': '1.0'
            }
            
            with open(mapping_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"💾 Mappings saved to {mapping_file}")
            
        except Exception as e:
            print(f"❌ Failed to save mappings to {mapping_file}: {e}")
    
    def learn_from_data(self, data_records: List[Dict[str, Any]]):
        """
        Learn item mappings from user's data that contains item_name and item_nbr
        
        Args:
            data_records (List[Dict]): Records containing item_name, item_nbr, category, etc.
        """
        learned_count = 0
        
        for record in data_records:
            item_nbr = record.get('item_nbr')
            item_name = record.get('item_name')
            
            # Learn item name mappings from user data
            if item_nbr and item_name and item_nbr not in self.item_mappings:
                self.item_mappings[int(item_nbr)] = str(item_name).strip()
                learned_count += 1
        
        if learned_count > 0:
            print(f"📚 Learned {learned_count} new item mappings from user data")
    
    def get_item_name(self, item_nbr: int, fallback: bool = True) -> str:
        """
        Get readable name for item number
        
        Args:
            item_nbr (int): Item number
            fallback (bool): If True, generate fallback name when not found
            
        Returns:
            str: Readable item name
        """
        if item_nbr in self.item_mappings:
            return self.item_mappings[item_nbr]
        
        if fallback:
            return f"Item #{item_nbr}"
        
        return None
    
    def get_category_name(self, category: str, fallback: bool = True) -> str:
        """
        Get readable name for category
        
        Args:
            category (str): Category code
            fallback (bool): If True, return original when not found
            
        Returns:
            str: Readable category name
        """
        if category in self.category_mappings:
            return self.category_mappings[category]
        
        if fallback:
            # Clean up category name
            return category.replace('_', ' ').title()
        
        return None
    
    def get_class_name(self, item_class: int, fallback: bool = True) -> str:
        """
        Get readable name for item class
        
        Args:
            item_class (int): Item class number
            fallback (bool): If True, generate fallback name when not found
            
        Returns:
            str: Readable class name
        """
        if item_class in self.class_mappings:
            return self.class_mappings[item_class]
        
        if fallback:
            return f"Class {item_class}"
        
        return None
    
    def enrich_predictions(self, predictions: List[Dict[str, Any]], 
                          original_data: Optional[List[Dict[str, Any]]] = None) -> List[Dict[str, Any]]:
        """
        Enrich prediction records with readable names
        
        Args:
            predictions (List[Dict]): List of prediction records
            original_data (List[Dict], optional): Original data to learn item names from
            
        Returns:
            List[Dict]: Enriched prediction records
        """
        # First, learn from original data if provided
        if original_data:
            self.learn_from_data(original_data)
        
        enriched = []
        
        for pred in predictions:
            enriched_pred = pred.copy()
            
            # Add readable item name (prioritize existing item_name if present)
            if 'item_name' not in pred or pd.isna(pred.get('item_name')) or not pred.get('item_name'):
                item_nbr = pred.get('item_nbr')
                if item_nbr:
                    enriched_pred['item_name'] = self.get_item_name(item_nbr)
            
            # Add readable category name
            category = pred.get('category')
            if category:
                enriched_pred['category_name'] = self.get_category_name(category)
            
            # Add readable class name
            item_class = pred.get('item_class')
            if item_class:
                enriched_pred['class_name'] = self.get_class_name(item_class)
            
            # Add product type indicator
            perishable = pred.get('perishable', 0)
            enriched_pred['product_type'] = 'Perishable' if perishable == 1 else 'Non-Perishable'
            
            enriched.append(enriched_pred)
        
        return enriched
    
    def create_chart_data(self, predictions: List[Dict[str, Any]], 
                         group_by: str = 'category', 
                         top_n: int = 10) -> Dict[str, Any]:
        """
        Create chart data for visualization
        
        Args:
            predictions (List[Dict]): Enriched prediction records
            group_by (str): Group by 'category', 'item', 'store', or 'class'
            top_n (int): Number of top items to include
            
        Returns:
            Dict: Chart data with labels and values
        """
        if not predictions:
            return {'labels': [], 'values': [], 'colors': []}
        
        df = pd.DataFrame(predictions)
        
        # Group data based on parameter
        if group_by == 'category':
            grouped = df.groupby('category_name')['predicted_sales'].sum().sort_values(ascending=False)
            title = f"Top {top_n} Categories by Predicted Sales"
            
        elif group_by == 'item':
            grouped = df.groupby('item_name')['predicted_sales'].sum().sort_values(ascending=False)
            title = f"Top {top_n} Items by Predicted Sales"
            
        elif group_by == 'store':
            grouped = df.groupby('store_nbr')['predicted_sales'].sum().sort_values(ascending=False)
            title = f"Top {top_n} Stores by Predicted Sales"
            grouped.index = [f"Store {store_id}" for store_id in grouped.index]
            
        elif group_by == 'class':
            grouped = df.groupby('class_name')['predicted_sales'].sum().sort_values(ascending=False)
            title = f"Top {top_n} Product Classes by Predicted Sales"
            
        else:
            raise ValueError(f"Invalid group_by parameter: {group_by}")
        
        # Get top N
        top_items = grouped.head(top_n)
        
        # Generate colors
        colors = self._generate_colors(len(top_items))
        
        return {
            'title': title,
            'labels': top_items.index.tolist(),
            'values': top_items.values.tolist(),
            'colors': colors,
            'total': float(grouped.sum()),
            'group_by': group_by
        }
    
    def _generate_colors(self, n: int) -> List[str]:
        """
        Generate color palette for charts
        
        Args:
            n (int): Number of colors needed
            
        Returns:
            List[str]: List of hex color codes
        """
        # Professional color palette
        base_colors = [
            '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
            '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
            '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
            '#c49c94', '#f7b6d3', '#c7c7c7', '#dbdb8d', '#9edae5'
        ]
        
        # Repeat colors if needed
        colors = []
        for i in range(n):
            colors.append(base_colors[i % len(base_colors)])
        
        return colors
    
    def get_stats(self) -> Dict[str, int]:
        """
        Get mapping statistics
        
        Returns:
            Dict: Statistics about loaded mappings
        """
        return {
            'total_items': len(self.item_mappings),
            'total_categories': len(self.category_mappings),
            'total_classes': len(self.class_mappings)
        }
    
    def add_item_mapping(self, item_nbr: int, item_name: str):
        """
        Add or update item mapping
        
        Args:
            item_nbr (int): Item number
            item_name (str): Readable item name
        """
        self.item_mappings[item_nbr] = item_name
    
    def add_category_mapping(self, category_code: str, category_name: str):
        """
        Add or update category mapping
        
        Args:
            category_code (str): Category code
            category_name (str): Readable category name
        """
        self.category_mappings[category_code] = category_name
    
    def add_class_mapping(self, class_code: int, class_name: str):
        """
        Add or update class mapping
        
        Args:
            class_code (int): Class code
            class_name (str): Readable class name
        """
        self.class_mappings[class_code] = class_name
    
    def analyze_unmapped_items(self, predictions: List[Dict[str, Any]]) -> Dict[str, List]:
        """
        Analyze predictions to find unmapped items, categories, and classes
        
        Args:
            predictions (List[Dict]): Prediction records
            
        Returns:
            Dict: Lists of unmapped items, categories, and classes
        """
        df = pd.DataFrame(predictions)
        
        unmapped_items = []
        unmapped_categories = []
        unmapped_classes = []
        
        # Find unmapped items
        if 'item_nbr' in df.columns:
            for item_nbr in df['item_nbr'].unique():
                if item_nbr not in self.item_mappings:
                    unmapped_items.append(int(item_nbr))
        
        # Find unmapped categories
        if 'category' in df.columns:
            for category in df['category'].unique():
                if pd.notna(category) and category not in self.category_mappings:
                    unmapped_categories.append(str(category))
        
        # Find unmapped classes
        if 'item_class' in df.columns:
            for item_class in df['item_class'].unique():
                if pd.notna(item_class) and item_class not in self.class_mappings:
                    unmapped_classes.append(int(item_class))
        
        return {
            'unmapped_items': sorted(unmapped_items),
            'unmapped_categories': sorted(unmapped_categories),
            'unmapped_classes': sorted(unmapped_classes)
        }


def create_sample_mappings():
    """Create and save sample mappings file"""
    mapper = ItemMapper()
    
    # Add some additional sample mappings
    additional_items = {
        111111: 'Premium Coffee Beans (1lb)',
        222222: 'Organic Whole Wheat Bread',
        333333: 'Fresh Salmon Fillet (1lb)',
        444444: 'Greek Yogurt (32oz)',
        555555: 'Extra Virgin Olive Oil (16.9oz)',
        666666: 'Organic Baby Spinach (5oz)',
        777777: 'Dark Chocolate Bar (3.5oz)',
        888888: 'Coconut Water (16.9oz)',
        999999: 'Quinoa (2lb)',
        101010: 'Avocados (4 pack)'
    }
    
    for item_nbr, item_name in additional_items.items():
        mapper.add_item_mapping(item_nbr, item_name)
    
    # Save to file
    mapper.save_mappings('item_mappings.json')
    print("📁 Sample mappings created and saved to 'item_mappings.json'")
    
    return mapper


def main():
    """Demo function"""
    print("🗺️ ItemMapper Demo")
    print("=" * 50)
    
    # Create mapper
    mapper = ItemMapper()
    
    # Show stats
    stats = mapper.get_stats()
    print(f"📊 Mapping Statistics:")
    print(f"   Items: {stats['total_items']}")
    print(f"   Categories: {stats['total_categories']}")
    print(f"   Classes: {stats['total_classes']}")
    
    # Sample predictions
    sample_predictions = [
        {
            'store_nbr': 1,
            'item_nbr': 108952,
            'category': 'CLEANING',
            'item_class': 3024,
            'predicted_sales': 15.5,
            'perishable': 0
        },
        {
            'store_nbr': 1,
            'item_nbr': 402175,
            'category': 'GROCERY I',
            'item_class': 1096,
            'predicted_sales': 25.2,
            'perishable': 0
        },
        {
            'store_nbr': 2,
            'item_nbr': 123456,
            'category': 'PRODUCE',
            'item_class': 2002,
            'predicted_sales': 45.8,
            'perishable': 1
        }
    ]
    
    # Enrich predictions
    print(f"\n🔧 Enriching predictions...")
    enriched = mapper.enrich_predictions(sample_predictions)
    
    print(f"📋 Enriched predictions:")
    for pred in enriched:
        print(f"   Store {pred['store_nbr']}: {pred['item_name']} ({pred['category_name']}) - ${pred['predicted_sales']:.2f}")
    
    # Create chart data
    print(f"\n📊 Creating chart data...")
    chart_data = mapper.create_chart_data(enriched, 'category')
    print(f"Category chart: {chart_data['labels']} = {chart_data['values']}")
    
    # Create sample mappings file
    print(f"\n💾 Creating sample mappings...")
    create_sample_mappings()


if __name__ == "__main__":
    main()