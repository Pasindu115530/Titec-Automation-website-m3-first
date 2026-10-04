import os
import re

models = {
    'Invoice': 'pos',
    'Installation': 'installations',
    'StockMovement': 'inventory',
    'Product': 'products',
    'Client': 'clients',
    'User': 'users',
    'Quotation': 'quotations',
    'Brand': 'brands',
    'ServiceCategory': 'services',
    'Project': 'projects'
}

base_dir = '/media/thulana/Projects/Projects/Clients/Titec/Titec-Automation-website-m3-first/backend-laravel/app/Models'

for model, log_name in models.items():
    file_path = os.path.join(base_dir, f'{model}.php')
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r') as f:
        content = f.read()
        
    if 'LogsActivity' in content:
        continue
        
    # Add imports
    content = re.sub(
        r'(namespace App\\Models;)', 
        r'\1\n\nuse Spatie\\Activitylog\\Traits\\LogsActivity;\nuse Spatie\\Activitylog\\LogOptions;', 
        content
    )
    
    # Add trait
    content = re.sub(
        r'(use HasFactory)',
        r'use LogsActivity, HasFactory',
        content,
        count=1
    )
    
    # Add method
    method = f"""

    public function getActivitylogOptions(): LogOptions
    {{
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->useLogName('{log_name}')
            ->setDescriptionForEvent(fn(string $eventName) => "{model} {{$eventName}}");
    }}
"""
    # Insert before the last closing brace
    content = re.sub(r'}\s*$', method + '}\n', content)
    
    with open(file_path, 'w') as f:
        f.write(content)

print("Models updated.")
