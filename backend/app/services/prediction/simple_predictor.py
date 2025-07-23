
# ============ 使用说明 ============
"""
1. 将此文件保存为 simple_predictor.py
2. 确保 my_saved_model 文件夹在同一目录
3. 运行: python simple_predictor.py

快速使用:
```python
from simple_predictor import LocalSalesPredictor

# 创建预测器
predictor = LocalSalesPredictor()

# 预测
predictions = predictor.predict('your_data.csv')
print(predictions)
```

数据格式要求:
- CSV文件包含: id,date,store_nbr,item_nbr,unit_sales,onpromotion,category,item_class,perishable
- 至少30天历史数据
- 日期格式: YYYY-MM-DD
"""


import pickle
import joblib
import lightgbm as lgb
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

class LocalSalesPredictor:
    """
    Local Sales Predictor - Uses downloaded model files
    Supports multiple model formats: pickle, joblib, LightGBM native format
    """
    
    def __init__(self, model_dir="/Users/wangjiamin/Documents/GitHub/ShelfSmart/backend/app/services/prediction/my_saved_model_resaved"):
        self.model_dir = model_dir
        self.model = None
        self.features = None
        self.metadata = None
        self.is_ready = False
        self.load_method = None
    
    def load_model(self):
        """Load model files - supports multiple formats"""
        try:
            print(f"📥 Loading model from {self.model_dir}...")
            
            # Define possible model files, ordered by priority
            model_candidates = [
                # New compatible formats (priority)
                ('model_joblib.pkl', 'joblib'),
                ('model_native.txt', 'lightgbm_native'),
                ('model_pickle_v4.pkl', 'pickle_v4'),
                ('model_pickle_latest.pkl', 'pickle_latest'),
                # Original format (last attempt)
                ('my_sales_model.pkl', 'pickle_original')
            ]
            
            model_loaded = False
            
            # Try different model files
            for filename, method in model_candidates:
                model_file = os.path.join(self.model_dir, filename)
                
                if not os.path.exists(model_file):
                    continue
                
                print(f"🔄 Trying to load {filename} using {method}...")
                
                try:
                    if method == 'lightgbm_native':
                        # LightGBM native format
                        self.model = lgb.Booster(model_file=model_file)
                        self.load_method = method
                        print(f"✅ {method} loaded successfully!")
                        model_loaded = True
                        break
                        
                    elif method == 'joblib':
                        # Joblib format
                        self.model = joblib.load(model_file)
                        self.load_method = method
                        print(f"✅ {method} loaded successfully!")
                        model_loaded = True
                        break
                        
                    else:
                        # Pickle format, try different encoding methods
                        for encoding in [None, 'latin1', 'bytes']:
                            try:
                                with open(model_file, 'rb') as f:
                                    if encoding:
                                        self.model = pickle.load(f, encoding=encoding)
                                    else:
                                        self.model = pickle.load(f)
                                
                                self.load_method = f"{method}_encoding_{encoding}"
                                print(f"✅ {method} (encoding={encoding}) loaded successfully!")
                                model_loaded = True
                                break
                                
                            except Exception as e:
                                if encoding == 'bytes':  # Last attempt
                                    print(f"❌ {method} failed with all encodings: {e}")
                                continue
                        
                        if model_loaded:
                            break
                            
                except Exception as e:
                    print(f"❌ {method} loading failed: {e}")
                    continue
            
            if not model_loaded:
                raise RuntimeError("All model formats failed to load!")
            
            # Load feature information
            features_candidates = ['features.json']
            for features_file in features_candidates:
                features_path = os.path.join(self.model_dir, features_file)
                if os.path.exists(features_path):
                    try:
                        with open(features_path, 'r') as f:
                            self.features = json.load(f)
                        print(f"✅ Feature info loaded successfully: {self.features.get('num_features', len(self.features.get('feature_columns', [])))} features")
                        break
                    except Exception as e:
                        print(f"⚠️ Feature file {features_file} loading failed: {e}")
            
            # If no features.json found, try to extract from model
            if not self.features and hasattr(self.model, 'feature_name'):
                try:
                    feature_names = self.model.feature_name()
                    if feature_names:
                        self.features = {
                            'feature_columns': feature_names,
                            'num_features': len(feature_names),
                            'source': 'extracted_from_model'
                        }
                        print(f"✅ Extracted feature info from model: {len(feature_names)} features")
                    else:
                        print("⚠️ No feature names found in model")
                except Exception as e:
                    print(f"⚠️ Failed to extract features from model: {e}")
            
            # If still no features, try to copy from original directory
            if not self.features:
                original_features_path = self.model_dir.replace('my_saved_model_resaved', 'my_saved_model')
                original_features_file = os.path.join(original_features_path, 'features.json')
                if os.path.exists(original_features_file):
                    try:
                        with open(original_features_file, 'r') as f:
                            self.features = json.load(f)
                        print(f"✅ Loaded feature info from original directory: {len(self.features.get('feature_columns', []))} features")
                    except Exception as e:
                        print(f"⚠️ Failed to load features from original directory: {e}")
                else:
                    print(f"⚠️ Original directory also has no feature file: {original_features_file}")
            
            if not self.features:
                print("❌ Unable to obtain feature information, this will cause prediction failure")
            
            # Load metadata
            metadata_candidates = ['metadata.json', 'version_info.json']
            for metadata_file in metadata_candidates:
                metadata_path = os.path.join(self.model_dir, metadata_file)
                if os.path.exists(metadata_path):
                    try:
                        with open(metadata_path, 'r') as f:
                            self.metadata = json.load(f)
                        print(f"✅ Metadata loaded successfully")
                        break
                    except Exception as e:
                        print(f"⚠️ Metadata file {metadata_file} loading failed: {e}")
            
            self.is_ready = True
            print(f"🎉 Model loading complete! Using method: {self.load_method}")
            print(f"📋 Model info:")
            print(f"   Type: {type(self.model)}")
            if hasattr(self.model, 'num_feature'):
                print(f"   Features: {self.model.num_feature()}")
            
            return True
            
        except Exception as e:
            print(f"❌ Model loading failed: {e}")
            return False
    
    def extract_and_save_features(self):
        """Extract and save feature information from model"""
        if hasattr(self.model, 'feature_name'):
            try:
                feature_names = self.model.feature_name()
                if feature_names:
                    features_info = {
                        'feature_columns': feature_names,
                        'num_features': len(feature_names),
                        'source': 'extracted_from_model',
                        'extracted_date': pd.Timestamp.now().isoformat()
                    }
                    
                    # Save to current model directory
                    features_path = os.path.join(self.model_dir, 'features_extracted.json')
                    with open(features_path, 'w') as f:
                        json.dump(features_info, f, indent=2)
                    
                    print(f"💾 Feature info extracted and saved to: {features_path}")
                    print(f"📋 Extracted features ({len(feature_names)} total):")
                    
                    for i, feat in enumerate(feature_names):
                        print(f"  {i+1:2d}. {feat}")
                    
                    return feature_names
                else:
                    print("❌ No feature names found in model")
                    return []
            except Exception as e:
                print(f"❌ Feature extraction failed: {e}")
                return []
        else:
            print("❌ Model does not support feature name extraction")
            return []
    
    def debug_features(self):
        """Debug feature information"""
        if self.features and 'feature_columns' in self.features:
            feature_columns = self.features['feature_columns']
            print(f"🔍 Features used in training ({len(feature_columns)} total):")
            for i, feat in enumerate(feature_columns):
                print(f"  {i+1:2d}. {feat}")
            return feature_columns
        else:
            print("❌ No feature list information found")
            return []
    
    def compare_features(self, generated_features, expected_features):
        """Compare generated features with expected features"""
        print(f"\n🔍 Feature comparison analysis:")
        print(f"   Generated features count: {len(generated_features)}")
        print(f"   Expected features count: {len(expected_features)}")
        
        # Find missing features
        missing = set(expected_features) - set(generated_features)
        extra = set(generated_features) - set(expected_features)
        
        if missing:
            print(f"\n❌ Missing features ({len(missing)} total):")
            for i, feat in enumerate(sorted(missing)):
                print(f"  {i+1:2d}. {feat}")
        
        if extra:
            print(f"\n➕ Extra features ({len(extra)} total):")
            for i, feat in enumerate(sorted(extra)):
                print(f"  {i+1:2d}. {feat}")
        
        if not missing and not extra:
            print("✅ Features match perfectly!")
        
        return missing, extra
    
    def _predict_with_model(self, X_features):
        """Predict based on different model types"""
        try:
            if 'lightgbm_native' in self.load_method:
                # LightGBM Booster object
                predictions = self.model.predict(X_features.values)
            elif hasattr(self.model, 'predict'):
                # Standard predict method
                predictions = self.model.predict(X_features.values)
            else:
                raise RuntimeError(f"Unsupported model type: {type(self.model)}")
            
            return predictions
            
        except Exception as e:
            print(f"❌ Prediction execution failed: {e}")
            print(f"   Model type: {type(self.model)}")
            print(f"   Loading method: {self.load_method}")
            print(f"   Input feature shape: {X_features.shape}")
            raise
    
    def validate_input_data(self, df):
        """Validate input data format"""
        required_columns = ['date', 'store_nbr', 'item_nbr', 'unit_sales', 'onpromotion', 'category', 'item_class', 'perishable']
        
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")
        
        # Check data volume
        if len(df) < 30:
            print("⚠️ Warning: Limited data, recommend at least 30 days of historical data")
        
        # Check date format
        try:
            df['date'] = pd.to_datetime(df['date'])
        except:
            raise ValueError("Date format error, please use YYYY-MM-DD format")
        
        return True
    
    def preprocess_data(self, df):
        """Preprocess data"""
        print("🔧 Preprocessing data...")
        
        # Validate data
        self.validate_input_data(df)
        
        # Create pivot tables
        df_pivot = df.set_index(['store_nbr', 'item_nbr', 'date'])['unit_sales'].unstack(-1).fillna(0)
        promo_pivot = df.set_index(['store_nbr', 'item_nbr', 'date'])['onpromotion'].unstack(-1).fillna(False)
        items = df[['item_nbr', 'category', 'item_class', 'perishable']].drop_duplicates().set_index('item_nbr')
        
        print(f"   📊 Pivot table shape: {df_pivot.shape}")
        print(f"   🏪 Number of stores: {len(df_pivot.index.get_level_values(0).unique())}")
        print(f"   📦 Number of items: {len(df_pivot.index.get_level_values(1).unique())}")
        
        return df_pivot, promo_pivot, items
    
    def generate_features(self, df_pivot, promo_pivot, items, target_date):
        """Generate prediction features"""
        print(f"🔧 Generating features for date {target_date}...")
        
        def get_timespan(df, dt, minus, periods, freq='D'):
            try:
                dates = pd.date_range(dt - timedelta(days=minus), periods=periods, freq=freq)
                available_dates = [d for d in dates if d in df.columns]
                if len(available_dates) == 0:
                    return pd.DataFrame(index=df.index)
                return df[available_dates]
            except:
                return pd.DataFrame(index=df.index)
        
        X = {}
        
        # Basic sales features
        for period in [7, 14, 30, 60]:
            sales_data = get_timespan(df_pivot, target_date, period, period)
            if not sales_data.empty and len(sales_data.columns) > 0:
                X[f'mean_{period}'] = sales_data.mean(axis=1).values
                X[f'median_{period}'] = sales_data.median(axis=1).values
                X[f'std_{period}'] = sales_data.std(axis=1).fillna(0).values
                X[f'max_{period}'] = sales_data.max(axis=1).values
                X[f'min_{period}'] = sales_data.min(axis=1).values
                X[f'sum_{period}'] = sales_data.sum(axis=1).values
                
                # Weighted average (recent data has higher weight)
                weights = np.power(0.9, np.arange(len(sales_data.columns))[::-1])
                X[f'weighted_mean_{period}'] = (sales_data.values * weights).sum(axis=1) / weights.sum()
                
                # Trend features
                if len(sales_data.columns) > 1:
                    X[f'diff_mean_{period}'] = sales_data.diff(axis=1).mean(axis=1).fillna(0).values
                else:
                    X[f'diff_mean_{period}'] = np.zeros(len(df_pivot))
            else:
                # Fill with zeros
                for suffix in ['mean', 'median', 'std', 'max', 'min', 'sum', 'weighted_mean', 'diff_mean']:
                    X[f'{suffix}_{period}'] = np.zeros(len(df_pivot))
        
        # Promotion features
        for period in [7, 14, 30, 60]:
            promo_data = get_timespan(promo_pivot, target_date, period, period)
            if not promo_data.empty:
                X[f'promo_sum_{period}'] = promo_data.sum(axis=1).values
                X[f'promo_mean_{period}'] = promo_data.mean(axis=1).values
            else:
                X[f'promo_sum_{period}'] = np.zeros(len(df_pivot))
                X[f'promo_mean_{period}'] = np.zeros(len(df_pivot))
        
        # Lag features (recent days sales)
        for i in range(1, 8):
            day_data = get_timespan(df_pivot, target_date, i, 1)
            if not day_data.empty:
                X[f'lag_{i}'] = day_data.values.ravel()
            else:
                X[f'lag_{i}'] = np.zeros(len(df_pivot))
        
        # Day of week features
        target_dow = target_date.weekday()
        for weeks_back in [4, 8]:
            dow_data = get_timespan(df_pivot, target_date, weeks_back*7-target_dow, weeks_back, freq='7D')
            if not dow_data.empty:
                X[f'dow_mean_{weeks_back}w'] = dow_data.mean(axis=1).values
            else:
                X[f'dow_mean_{weeks_back}w'] = np.zeros(len(df_pivot))
        
        # Store and item information
        X['store_nbr'] = df_pivot.index.get_level_values(0)
        X['item_nbr'] = df_pivot.index.get_level_values(1)
        
        # Item features
        # item_features = items.reindex(df_pivot.index.get_level_values(1))
        # for col in items.columns:
        #     if col in ['category', 'item_class', 'perishable']:
        #         X[f'item_{col}'] = item_features[col].values

        if "item_nbr" in items.columns:
            items = items.set_index("item_nbr")
        # 确保唯一
        items = items[~items.index.duplicated(keep="first")]
        df_item_df = pd.DataFrame({"item_nbr": df_pivot.index.get_level_values(1)})
        item_features = df_item_df.merge(items, left_on="item_nbr", right_index=True, how="left")

        
        # Time features
        X['dayofweek'] = target_date.weekday()
        X['month'] = target_date.month
        X['quarter'] = target_date.quarter
        X['year'] = target_date.year
        X['day'] = target_date.day
        
        # Convert to DataFrame
        X_df = pd.DataFrame(X)
        
        # Fix data types
        for col in X_df.columns:
            if X_df[col].dtype == 'object':
                try:
                    X_df[col] = pd.to_numeric(X_df[col], errors='coerce').fillna(0)
                except:
                    # Encode strings
                    unique_vals = X_df[col].unique()
                    val_map = {val: i for i, val in enumerate(unique_vals)}
                    X_df[col] = X_df[col].map(val_map)
            
            if X_df[col].dtype not in ['int64', 'int32', 'float64', 'float32', 'bool']:
                X_df[col] = X_df[col].astype('float64')
        
        # Handle generic column names (Column_0, Column_1, etc.)
        if self.features and 'feature_columns' in self.features:
            feature_columns = self.features['feature_columns']
            
            # Check if using generic column names
            if all(col.startswith('Column_') for col in feature_columns):
                print(f"   📋 Model uses generic column names (Column_0 to Column_{len(feature_columns)-1})")
                print(f"   📋 Generated meaningful features: {len(X_df.columns)}")
                
                # Map our meaningful features to the expected number of columns
                current_features = list(X_df.columns)
                
                # If we have fewer features than expected, we need to add more
                if len(current_features) < len(feature_columns):
                    missing_count = len(feature_columns) - len(current_features)
                    print(f"   ⚠️ Need {missing_count} more features. Generating additional features...")
                    
                    # Add more derived features to reach the required count
                    self._add_additional_features(X_df, df_pivot, promo_pivot, items, target_date, missing_count)
                
                # Trim or pad to exact number needed
                feature_values = X_df.values
                if feature_values.shape[1] > len(feature_columns):
                    # Take first N features
                    feature_values = feature_values[:, :len(feature_columns)]
                    print(f"   ✂️ Trimmed to first {len(feature_columns)} features")
                elif feature_values.shape[1] < len(feature_columns):
                    # Pad with zeros
                    padding = np.zeros((feature_values.shape[0], len(feature_columns) - feature_values.shape[1]))
                    feature_values = np.hstack([feature_values, padding])
                    print(f"   ➕ Padded with {len(feature_columns) - X_df.shape[1]} zero features")
                
                # Create new DataFrame with generic column names
                X_df = pd.DataFrame(feature_values, columns=feature_columns, index=X_df.index)
                print(f"   ✅ Mapped to generic column names: {X_df.shape}")
                
            else:
                # Original logic for named features
                print(f"   📋 Training features count: {len(feature_columns)}")
                print(f"   📋 Generated features count: {len(X_df.columns)}")
                
                # Compare feature differences
                missing, extra = self.compare_features(list(X_df.columns), feature_columns)
                
                # Add missing features
                if missing:
                    print(f"   ⚠️ Adding {len(missing)} missing features...")
                    for col in missing:
                        X_df[col] = 0
                
                # Arrange in training order
                X_df = X_df[feature_columns]
                print(f"   ✅ Feature alignment complete: {X_df.shape}")
        else:
            print("   ⚠️ No feature list info, using currently generated features")
        
        print(f"   ✅ Feature generation complete: {X_df.shape}")
        return X_df
    
    def _add_additional_features(self, X_df, df_pivot, promo_pivot, items, target_date, needed_count):
        """Add additional derived features to reach the required count"""
        print(f"   🔧 Generating {needed_count} additional features...")
        
        def get_timespan(df, dt, minus, periods, freq='D'):
            try:
                dates = pd.date_range(dt - timedelta(days=minus), periods=periods, freq=freq)
                available_dates = [d for d in dates if d in df.columns]
                if len(available_dates) == 0:
                    return pd.DataFrame(index=df.index)
                return df[available_dates]
            except:
                return pd.DataFrame(index=df.index)
        
        additional_features = {}
        feature_count = 0
        
        # More complex time-based features
        for period in [3, 5, 21, 90]:  # Additional time windows
            if feature_count >= needed_count:
                break
            sales_data = get_timespan(df_pivot, target_date, period, period)
            if not sales_data.empty and len(sales_data.columns) > 0:
                if feature_count < needed_count:
                    additional_features[f'mean_{period}_extra'] = sales_data.mean(axis=1).values
                    feature_count += 1
                if feature_count < needed_count:
                    additional_features[f'std_{period}_extra'] = sales_data.std(axis=1).fillna(0).values
                    feature_count += 1
            else:
                if feature_count < needed_count:
                    additional_features[f'mean_{period}_extra'] = np.zeros(len(df_pivot))
                    feature_count += 1
                if feature_count < needed_count:
                    additional_features[f'std_{period}_extra'] = np.zeros(len(df_pivot))
                    feature_count += 1
        
        # Interaction features
        if 'store_nbr' in X_df.columns and 'month' in X_df.columns and feature_count < needed_count:
            additional_features['store_month_interaction'] = X_df['store_nbr'] * X_df['month']
            feature_count += 1
        
        if 'dayofweek' in X_df.columns and 'quarter' in X_df.columns and feature_count < needed_count:
            additional_features['dow_quarter_interaction'] = X_df['dayofweek'] * X_df['quarter']
            feature_count += 1
        
        # Ratio features
        if 'mean_7' in X_df.columns and 'mean_30' in X_df.columns and feature_count < needed_count:
            additional_features['ratio_7_30'] = X_df['mean_7'] / (X_df['mean_30'] + 0.001)
            feature_count += 1
        
        if 'max_7' in X_df.columns and 'min_7' in X_df.columns and feature_count < needed_count:
            additional_features['range_7'] = X_df['max_7'] - X_df['min_7']
            feature_count += 1
        
        # Fill remaining with polynomial features if needed
        base_features = ['store_nbr', 'item_nbr', 'dayofweek', 'month']
        for feature in base_features:
            if feature_count >= needed_count:
                break
            if feature in X_df.columns:
                additional_features[f'{feature}_squared'] = X_df[feature] ** 2
                feature_count += 1
        
        # Fill any remaining with zero features
        while feature_count < needed_count:
            additional_features[f'zero_feature_{feature_count}'] = np.zeros(len(X_df))
            feature_count += 1
        
        # Add to main DataFrame
        for feature_name, feature_values in additional_features.items():
            X_df[feature_name] = feature_values
        
        print(f"   ✅ Added {len(additional_features)} additional features")
    
    def predict(self, input_data, prediction_date=None, save_result=True):
        """
        Predict sales
        
        Args:
        - input_data: DataFrame or CSV file path
        - prediction_date: Prediction date (str "YYYY-MM-DD" or None for auto)
        - save_result: Whether to save results to CSV
        
        Returns:
        - DataFrame: Prediction results
        """
        if not self.is_ready:
            if not self.load_model():
                raise RuntimeError("Model loading failed")
        
        print("🎯 Starting sales prediction...")
        
        # Process input data
        if isinstance(input_data, str):
            if not os.path.exists(input_data):
                raise FileNotFoundError(f"File not found: {input_data}")
            df = pd.read_csv(input_data)
            print(f"📁 Loaded data from file: {input_data}")
        elif isinstance(input_data, pd.DataFrame):
            df = input_data.copy()
            print("📊 Using DataFrame data")
        else:
            raise ValueError("input_data must be DataFrame or CSV file path")
        
        print(f"   📊 Input data: {len(df)} records")
        
        # Preprocess data
        df_pivot, promo_pivot, items = self.preprocess_data(df)
        
        # Determine prediction date
        if prediction_date is None:
            latest_date = df['date'].max()
            prediction_date = pd.to_datetime(latest_date) + timedelta(days=1)
            print(f"   📅 Auto prediction date: {prediction_date.strftime('%Y-%m-%d')}")
        else:
            prediction_date = pd.to_datetime(prediction_date)
            print(f"   📅 Specified prediction date: {prediction_date.strftime('%Y-%m-%d')}")
        
        # Generate features
        X_features = self.generate_features(df_pivot, promo_pivot, items, prediction_date)
        
        # Make prediction
        print("🔮 Executing prediction...")
        try:
            predictions = self._predict_with_model(X_features)
            predictions = np.maximum(predictions, 0)  # Ensure non-negative
            
            # Create result DataFrame
            result_df = pd.DataFrame({
                'store_nbr': df_pivot.index.get_level_values(0),
                'item_nbr': df_pivot.index.get_level_values(1),
                'prediction_date': prediction_date.strftime('%Y-%m-%d'),
                'predicted_sales': np.round(predictions, 2)
            })
            
            print(f"✅ Prediction complete!")
            print(f"   📊 Prediction results: {len(result_df)} prediction values")
            print(f"   📈 Statistics:")
            print(f"      Average prediction: {np.mean(predictions):.2f}")
            print(f"      Max prediction: {np.max(predictions):.2f}")
            print(f"      Min prediction: {np.min(predictions):.2f}")
            print(f"      Using model: {self.load_method}")
            
            # Save results
            if save_result:
                output_file = f"predictions_{prediction_date.strftime('%Y%m%d')}.csv"
                result_df.to_csv(output_file, index=False)
                print(f"💾 Prediction results saved: {output_file}")
            
            return result_df
            
        except Exception as e:
            print(f"❌ Prediction failed: {e}")
            raise

def create_sample_data():
    """Create sample data for testing"""
    print("📝 Creating sample data...")
    
    sample_data = []
    base_date = pd.to_datetime('2024-01-01')
    
    # Create 60 days of historical data
    for days_back in range(60, 0, -1):
        date = base_date - timedelta(days=days_back)
        
        # Create different item-store combinations
        for store in [1, 2]:
            for item_info in [
                {'item_nbr': 108952, 'category': 'CLEANING', 'item_class': 3024},
                {'item_nbr': 402175, 'category': 'GROCERY I', 'item_class': 1096}
            ]:
                sample_data.append({
                    'id': len(sample_data),
                    'date': date.strftime('%Y-%m-%d'),
                    'store_nbr': store,
                    'item_nbr': item_info['item_nbr'],
                    'unit_sales': np.random.randint(1, 10),
                    'onpromotion': np.random.choice([True, False], p=[0.1, 0.9]),
                    'category': item_info['category'],
                    'item_class': item_info['item_class'],
                    'perishable': 0
                })
    
    sample_df = pd.DataFrame(sample_data)
    sample_df.to_csv('sample_sales_data.csv', index=False)
    
    print(f"✅ Sample data created: sample_sales_data.csv")
    print(f"   📊 Data statistics: {len(sample_df)} records")
    print(f"   📅 Date range: {sample_df['date'].min()} to {sample_df['date'].max()}")
    
    return sample_df

def main():
    """Main function - directly runs basic prediction demo"""
    print("🚀 Sales Prediction System - Basic Demo")
    print("=" * 50)
    
    try:
        # Create predictor
        predictor = LocalSalesPredictor()
        
        # Load model
        print("\n📝 Step 1: Load model")
        if not predictor.load_model():
            print("❌ Model loading failed, please check model files")
            return
        
        # Debug feature information
        print("\n📝 Step 1.5: Debug feature information")
        expected_features = predictor.debug_features()
        
        # If no feature info, try to extract from model
        if not expected_features:
            print("\n🔧 Step 1.6: Extract feature information from model")
            expected_features = predictor.extract_and_save_features()
            
            if expected_features:
                # Update predictor's feature info
                predictor.features = {
                    'feature_columns': expected_features,
                    'num_features': len(expected_features)
                }
            else:
                print("❌ Unable to get feature information, prediction may fail")
                return
        
        # Create sample data
        print("\n📝 Step 2: Create sample data")
        sample_df = create_sample_data()
        
        # Make predictions
        print("\n📝 Step 3: Execute prediction")
        try:
            predictions = predictor.predict(
                input_data='sample_sales_data.csv',
                prediction_date='2024-01-01'
            )
            
            print(f"\n🎯 Prediction results sample:")
            print(predictions.head(10))
            
            print(f"\n📊 Prediction summary:")
            summary = predictions.groupby('store_nbr')['predicted_sales'].agg(['count', 'mean', 'sum']).round(2)
            print(summary)
            
        except Exception as e:
            print(f"❌ Prediction process failed: {e}")
            import traceback
            traceback.print_exc()
            
    except KeyboardInterrupt:
        print("\n👋 Demo cancelled")
    except Exception as e:
        print(f"❌ Demo failed: {e}")

if __name__ == "__main__":
    main()


# ============ Usage Instructions ============
"""
1. Save this file as simple_predictor.py
2. Ensure my_saved_model folder is in the same directory
3. Run: python simple_predictor.py

Quick usage:
```python
from simple_predictor import LocalSalesPredictor

# Create predictor
predictor = LocalSalesPredictor()

# Make prediction
predictions = predictor.predict('your_data.csv')
print(predictions)
```

Data format requirements:
- CSV file contains: id,date,store_nbr,item_nbr,unit_sales,onpromotion,category,item_class,perishable
- At least 30 days of historical data
- Date format: YYYY-MM-DD
"""