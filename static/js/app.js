// Task and Calendar Management Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize FullCalendar
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: true,
        droppable: true,
        dragRevertDuration: 0,
        
        // Load events from API
        events: '/api/tasks',
        
        // Handle dropped tasks
        drop: function(info) {
            // Remove task from sidebar if it was dropped successfully
            const taskElement = info.draggedEl;
            const removeAfterDrop = true; // You can add a checkbox for this
            
            if (removeAfterDrop) {
                taskElement.style.display = 'none';
            }
        },
        
        // Handle event drag and drop
        eventDrop: function(info) {
            console.log('Event dropped:', info.event.title, 'to', info.event.start);
            // Here you could send an AJAX request to update the task due date
        },
        
        // Event click handler
        eventClick: function(info) {
            const event = info.event;
            const message = `Task: ${event.title}\nDescription: ${event.extendedProps.description || 'No description'}`;
            alert(message);
        },
        
        // Customize event rendering
        eventDidMount: function(info) {
            // Add tooltips to events
            info.el.setAttribute('title', info.event.extendedProps.description || info.event.title);
        }
    });
    
    calendar.render();
    
    // Initialize drag and drop for task items
    $('#external-events .task-item').each(function() {
        // Store data so the calendar knows to render an event upon drop
        $(this).data('event', {
            title: $.trim($(this).find('.task-title').text()),
            stick: true // maintain when user navigates
        });
        
        // Make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true,
            revertDuration: 0,
            helper: 'clone',
            start: function() {
                $(this).addClass('dragging');
            },
            stop: function() {
                $(this).removeClass('dragging');
            }
        });
    });
    
    // Auto-hide flash messages after 5 seconds
    setTimeout(function() {
        $('.alert').fadeOut();
    }, 5000);
    
    // Add smooth transitions for task actions
    $('.task-item').hover(
        function() {
            $(this).find('.task-actions').fadeIn(200);
        },
        function() {
            $(this).find('.task-actions').fadeOut(200);
        }
    );
    
    // Initialize task actions visibility
    $('.task-actions').hide();
    
    // Confirm delete functionality
    $('form[action*="delete_task"]').on('submit', function(e) {
        if (!confirm('Are you sure you want to delete this task?')) {
            e.preventDefault();
        }
    });
    
    // Auto-refresh calendar events periodically
    setInterval(function() {
        calendar.refetchEvents();
    }, 30000); // Refresh every 30 seconds
    
    // Handle task completion with visual feedback
    $('form[action*="toggle_task"]').on('submit', function(e) {
        const form = $(this);
        const taskItem = form.closest('.task-item');
        
        // Add a loading state
        const button = form.find('button');
        const originalHTML = button.html();
        button.html('<i class="fas fa-spinner fa-spin"></i>');
        button.prop('disabled', true);
        
        // Allow form to submit normally, but provide visual feedback
        setTimeout(function() {
            button.html(originalHTML);
            button.prop('disabled', false);
        }, 1000);
    });
    
    // Add keyboard shortcuts
    $(document).on('keydown', function(e) {
        // Ctrl/Cmd + N to add new task
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            $('#addTaskForm').collapse('show');
            $('input[name="title"]').focus();
        }
    });
    
    // Focus on title input when add task form is shown
    $('#addTaskForm').on('shown.bs.collapse', function() {
        $(this).find('input[name="title"]').focus();
    });
});

// Utility function to check if event is over a specific div
function isEventOverDiv(x, y) {
    const calendar = document.getElementById('calendar');
    const rect = calendar.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

// Add task drag visual feedback
$(document).on('dragstart', '.task-item', function() {
    $(this).addClass('dragging');
});

$(document).on('dragend', '.task-item', function() {
    $(this).removeClass('dragging');
});

// Custom CSS for dragging state
const style = document.createElement('style');
style.textContent = `
    .task-item.dragging {
        opacity: 0.5;
        transform: rotate(5deg);
    }
    
    .task-item.ui-draggable-dragging {
        box-shadow: 0 8px 25px rgba(0, 255, 238, 0.4);
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);
