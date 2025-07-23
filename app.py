import os
import logging
from datetime import datetime, date
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# In-memory storage for tasks
tasks = []
task_counter = 1

class Task:
    def __init__(self, id, title, description="", due_date=None, completed=False, created_at=None):
        self.id = id
        self.title = title
        self.description = description
        self.due_date = due_date
        self.completed = completed
        self.created_at = created_at or datetime.now()

@app.route('/')
def index():
    """Main page displaying tasks and calendar"""
    return render_template('index.html', tasks=tasks)

@app.route('/add_task', methods=['POST'])
def add_task():
    """Add a new task"""
    global task_counter
    
    title = request.form.get('title', '').strip()
    description = request.form.get('description', '').strip()
    due_date_str = request.form.get('due_date', '').strip()
    
    if not title:
        flash('Task title is required', 'error')
        return redirect(url_for('index'))
    
    due_date = None
    if due_date_str:
        try:
            due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
        except ValueError:
            flash('Invalid date format', 'error')
            return redirect(url_for('index'))
    
    task = Task(
        id=task_counter,
        title=title,
        description=description,
        due_date=due_date
    )
    
    tasks.append(task)
    task_counter += 1
    
    flash('Task added successfully', 'success')
    return redirect(url_for('index'))

@app.route('/toggle_task/<int:task_id>', methods=['POST'])
def toggle_task(task_id):
    """Toggle task completion status"""
    task = next((t for t in tasks if t.id == task_id), None)
    if task:
        task.completed = not task.completed
        flash(f'Task {"completed" if task.completed else "reopened"}', 'success')
    else:
        flash('Task not found', 'error')
    
    return redirect(url_for('index'))

@app.route('/delete_task/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    """Delete a task"""
    global tasks
    tasks = [t for t in tasks if t.id != task_id]
    flash('Task deleted', 'success')
    return redirect(url_for('index'))

@app.route('/edit_task/<int:task_id>', methods=['POST'])
def edit_task(task_id):
    """Edit an existing task"""
    task = next((t for t in tasks if t.id == task_id), None)
    if not task:
        flash('Task not found', 'error')
        return redirect(url_for('index'))
    
    title = request.form.get('title', '').strip()
    description = request.form.get('description', '').strip()
    due_date_str = request.form.get('due_date', '').strip()
    
    if not title:
        flash('Task title is required', 'error')
        return redirect(url_for('index'))
    
    task.title = title
    task.description = description
    
    if due_date_str:
        try:
            task.due_date = datetime.strptime(due_date_str, '%Y-%m-%d').date()
        except ValueError:
            flash('Invalid date format', 'error')
            return redirect(url_for('index'))
    else:
        task.due_date = None
    
    flash('Task updated successfully', 'success')
    return redirect(url_for('index'))

@app.route('/api/tasks')
def api_tasks():
    """API endpoint for calendar integration"""
    calendar_events = []
    for task in tasks:
        if task.due_date:
            calendar_events.append({
                'id': task.id,
                'title': task.title,
                'start': task.due_date.isoformat(),
                'className': 'completed-event' if task.completed else 'pending-event',
                'description': task.description
            })
    return jsonify(calendar_events)

@app.route('/filter/<filter_type>')
def filter_tasks(filter_type):
    """Filter tasks by type"""
    filtered_tasks = tasks
    
    if filter_type == 'active':
        filtered_tasks = [t for t in tasks if not t.completed]
    elif filter_type == 'completed':
        filtered_tasks = [t for t in tasks if t.completed]
    elif filter_type == 'overdue':
        today = date.today()
        filtered_tasks = [t for t in tasks if t.due_date and t.due_date < today and not t.completed]
    elif filter_type == 'upcoming':
        today = date.today()
        filtered_tasks = [t for t in tasks if t.due_date and t.due_date >= today]
    
    return render_template('index.html', tasks=filtered_tasks, filter_type=filter_type)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
