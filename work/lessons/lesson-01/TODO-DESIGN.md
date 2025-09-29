# Todo Manager System Design

## 1. Executive Summary

### Project Overview
A sophisticated multipanel terminal UI todo manager built with Node.js, TypeScript, and the blessed library. The application implements a clean MVC architecture to provide an intuitive, feature-rich task management experience directly in the terminal.

### Key Features and Functionality
- **Multipanel Terminal Interface**: Four distinct panels for different aspects of todo management
- **Eisenhower Matrix Priority System**: Four-level priority classification based on urgency and importance
- **Flexible Category System**: Predefined categories with custom category support
- **Time Tracking**: Automatic time creation, elapsed time calculation, and due date management
- **Weekly Progress Tracking**: Separate panel for monitoring progress using the 5 W's principle
- **Smart Reminders**: Automated reminder system with configurable timing
- **Location Integration**: Optional Google Maps API integration for task locations
- **Collaboration Support**: Solo-focused with optional collaborator assignment

### Technology Stack Rationale
- **Node.js + TypeScript**: Robust runtime with strong typing for complex terminal applications
- **Blessed Library**: Comprehensive terminal UI framework with widget-based architecture
- **File-based Storage**: Simple, portable data persistence using JSON files
- **MVC Architecture**: Clean separation of concerns for maintainable, testable code

## 2. System Architecture

### MVC Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Model      │    │    Controller   │    │      View       │
│                 │    │                 │    │                 │
│ • TodoItem      │◄──►│ • CommandParser │◄──►│ • MainScreen    │
│ • TodoManager   │    │ • EventHandler  │    │ • TodoListPanel │
│ • DataStorage   │    │ • BusinessLogic │    │ • DetailsPanel  │
│ • Validation    │    │ • StateManager  │    │ • CommandPanel  │
│ • Categories    │    │ • ReminderMgr   │    │ • ProgressPanel │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Responsibilities

#### Model Layer
- **TodoItem**: Core data structure with all todo properties
- **TodoManager**: Business logic for CRUD operations and data validation
- **DataStorage**: File-based persistence with JSON format
- **CategoryManager**: Handle predefined and custom categories
- **PriorityManager**: Implement Eisenhower Matrix logic

#### Controller Layer
- **CommandParser**: Process CLI commands and user input
- **EventHandler**: Manage keyboard/mouse events and UI interactions
- **BusinessLogic**: Coordinate between Model and View
- **StateManager**: Track application state and panel focus
- **ReminderManager**: Handle notification scheduling and display

#### View Layer
- **MainScreen**: Root blessed screen container
- **TodoListPanel**: Display and navigate todo items
- **DetailsPanel**: Show/edit individual todo details
- **CommandPanel**: Input area for commands and todo creation
- **ProgressPanel**: Weekly progress tracking with 5 W's format

### Data Flow
1. User input → Controller (CommandParser/EventHandler)
2. Controller → Model (BusinessLogic operations)
3. Model → Controller (Data updates and validation results)
4. Controller → View (State changes and UI updates)
5. View → Controller (User interactions and events)

## 3. User Interface Design

### Terminal Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                        Todo Manager v1.0                        │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   Todo List     │   Details       │      Command Input          │
│   Panel         │   Panel         │      Panel                  │
│                 │                 │                             │
│  ☐ [P1] Study   │  Title: Study   │  > add "Review notes"       │
│  ☑ [P2] Work    │  Category: Study│                             │
│  ☐ [P3] Health  │  Priority: High │  Commands:                  │
│  ☐ [P4] Network │  Due: 1 week    │  • add <title> [options]    │
│                 │  Status: Active │  • list [filters]           │
│  [Scroll: ↑↓]   │                 │  • complete <id>            │
│  [Select: Tab]  │  [Edit: Enter]  │  • remove <id>              │
├─────────────────┴─────────────────┴─────────────────────────────┤
│                    Progress Tracking Panel                      │
│  Week 1: [What] Review notes [When] Today [Where] Library      │
│  Week 2: [Why] Exam prep [How] 2 hours daily                   │
├─────────────────────────────────────────────────────────────────┤
│ Status: 3 active | 1 completed | Next: Study (2 days) | F1:Help│
└─────────────────────────────────────────────────────────────────┘
```

### Panel Descriptions

#### 1. Todo List Panel (Left, 40% width)
- **Purpose**: Display all todos with visual status indicators
- **Features**:
  - Scrollable list with keyboard navigation (↑↓ arrows)
  - Priority indicators: [P1], [P2], [P3], [P4] with color coding
  - Status icons: ☐ (pending), ☑ (completed), ✗ (deleted), ⏰ (postponed)
  - Category badges and due date indicators
  - Real-time updates when todos are modified

#### 2. Details Panel (Center, 30% width)
- **Purpose**: Show and edit selected todo properties
- **Features**:
  - Full todo information display
  - Inline editing with Enter key
  - Field-by-field editing (title, description, category, etc.)
  - Time tracking display (created, elapsed, due)
  - Location and assignee information

#### 3. Command Input Panel (Right, 30% width)
- **Purpose**: Command entry and todo creation workflow
- **Features**:
  - Step-by-step todo creation process
  - Command history and autocomplete
  - Help system with available commands
  - Quick action buttons for common operations

#### 4. Progress Tracking Panel (Bottom, full width)
- **Purpose**: Weekly progress monitoring using 5 W's principle
- **Features**:
  - Four-week progress grid
  - 5 W's format: When, What, Where, Why, How
  - Visual progress indicators
  - Integration with main todo list

### Navigation and Interaction Patterns

#### Keyboard Shortcuts
- **Tab**: Cycle through panels
- **Enter**: Edit selected field or execute command
- **Escape**: Cancel editing or close dialogs
- **↑↓**: Navigate todo list
- **Ctrl+N**: Create new todo
- **Ctrl+D**: Delete selected todo
- **Ctrl+C**: Mark as complete
- **F1**: Show help
- **Ctrl+Q**: Quit application

#### Mouse Support (Optional)
- Click to select todos
- Click and drag for multi-selection
- Right-click context menus

## 4. Data Model

### TodoItem Structure

```typescript
interface TodoItem {
  id: string;                    // Unique identifier
  title: string;                 // Concise task name
  description: string;           // Details and remarks
  category: Category;            // Predefined or custom category
  priority: Priority;            // Eisenhower Matrix priority
  duration: Duration;            // Short/Mid/Long term
  status: TodoStatus;            // Pending/Completed/Deleted/Postponed
  timeCreated: Date;             // Auto-generated timestamp
  timeElapsed: number;           // Calculated elapsed time (minutes)
  timeDue: Date;                 // Due date based on duration
  timeRemaining: number;         // Days until due date
  place?: string;                // Optional location
  assignee: string;              // Default: current user
  collaborators: string[];       // Additional team members
  tags: string[];                // Custom tags for filtering
  createdAt: Date;               // System timestamp
  updatedAt: Date;               // Last modification time
}
```

### Enums and Types

```typescript
enum Category {
  PERSONAL = "personal",
  STUDY = "study", 
  BUSINESS = "business",
  NETWORKING = "networking",
  PART_TIME_JOB = "part-time job",
  HEALTH = "health",
  WORK_OUT = "work out",
  CUSTOM = "custom"              // For user-defined categories
}

enum Priority {
  URGENT_IMPORTANT = 1,          // Top priority
  URGENT_NOT_IMPORTANT = 2,      // Second priority  
  NOT_URGENT_IMPORTANT = 3,      // Third priority
  NOT_URGENT_NOT_IMPORTANT = 4   // Least priority
}

enum Duration {
  SHORT_TERM = "short term",     // 1 week default
  MID_TERM = "mid term",         // 1 month default
  LONG_TERM = "long term"        // 3+ months default
}

enum TodoStatus {
  PENDING = "pending",
  COMPLETED = "completed", 
  DELETED = "deleted",
  POSTPONED = "postponed"
}
```

### Data Validation Rules

#### Title Validation
- Required field, cannot be empty
- Maximum 100 characters
- Trimmed whitespace

#### Description Validation
- Optional field
- Maximum 500 characters
- Support for multi-line text

#### Category Validation
- Must be valid enum value or custom category
- Custom categories limited to 50 characters
- Case-insensitive matching

#### Priority Validation
- Must be valid Priority enum (1-4)
- Default to NOT_URGENT_NOT_IMPORTANT if not specified

#### Time Validation
- timeCreated: Auto-generated, immutable
- timeDue: Must be in the future
- Duration-based defaults:
  - Short term: +7 days
  - Mid term: +30 days  
  - Long term: +90 days

### Storage Format

#### File Structure
```
data/
├── todos.json              # Main todo items
├── categories.json         # Custom categories
├── progress.json           # Weekly progress data
├── settings.json           # User preferences
└── backups/                # Backup files
    ├── todos_2024-01-15.json
    └── progress_2024-01-15.json
```

#### JSON Schema Example
```json
{
  "todos": [
    {
      "id": "todo_001",
      "title": "Review TypeScript notes",
      "description": "Go through chapters 1-5 and practice examples",
      "category": "study",
      "priority": 1,
      "duration": "short term",
      "status": "pending",
      "timeCreated": "2024-01-15T10:30:00Z",
      "timeElapsed": 120,
      "timeDue": "2024-01-22T23:59:59Z",
      "timeRemaining": 5,
      "place": "Library",
      "assignee": "user",
      "collaborators": [],
      "tags": ["typescript", "study"],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2024-01-15T10:30:00Z",
    "totalTodos": 1
  }
}
```

## 5. Technical Specifications

### Dependencies and Libraries

#### Core Dependencies
```json
{
  "blessed": "^0.1.81",           // Terminal UI framework
  "typescript": "^5.0.0",         // TypeScript compiler
  "@types/blessed": "^0.1.21",    // TypeScript definitions
  "@types/node": "^20.0.0"        // Node.js type definitions
}
```

#### Development Dependencies
```json
{
  "ts-node": "^10.9.0",           // TypeScript execution
  "nodemon": "^3.0.0",            // Development server
  "eslint": "^8.0.0",             // Code linting
  "@typescript-eslint/parser": "^6.0.0",
  "prettier": "^3.0.0"            // Code formatting
}
```

#### Optional Dependencies
```json
{
  "node-cron": "^3.0.0",          // Reminder scheduling
  "chalk": "^4.1.2",              // Terminal colors
  "commander": "^11.0.0"          // CLI argument parsing
}
```

### Performance Requirements

#### Response Time
- UI updates: < 100ms
- File operations: < 500ms
- Command processing: < 200ms
- Screen rendering: < 50ms

#### Memory Usage
- Base application: < 50MB
- Per 1000 todos: +10MB
- Maximum todos: 10,000 items

#### File Size Limits
- Individual todo: < 1KB
- Total data file: < 10MB
- Backup retention: 30 days

### Cross-Platform Compatibility

#### Supported Platforms
- **Windows**: Windows 10/11 with PowerShell or Command Prompt
- **macOS**: macOS 10.15+ with Terminal.app
- **Linux**: Ubuntu 18.04+, CentOS 7+, other modern distributions

#### Terminal Requirements
- Minimum terminal size: 80x24 characters
- Recommended size: 120x30 characters
- Color support: 256 colors minimum
- Unicode support for special characters

### Security and Data Integrity

#### Data Protection
- File permissions: 600 (owner read/write only)
- Backup encryption: Optional AES-256
- Input sanitization: Prevent injection attacks
- Path traversal protection: Validate file paths

#### Error Handling
- Graceful degradation on file system errors
- Data corruption detection and recovery
- Automatic backup creation before major operations
- Transaction-like operations for data consistency

## 6. Risk Assessment

### Potential Technical Challenges

#### 1. Blessed Library Limitations
- **Risk**: Complex UI layouts may be difficult to implement
- **Mitigation**: Start with simple layouts, use blessed-contrib for advanced widgets
- **Alternative**: Consider neo-blessed or ink for modern terminal UI

#### 2. Terminal Compatibility Issues
- **Risk**: Different terminals may render UI differently
- **Mitigation**: Test on major terminals, provide fallback modes
- **Alternative**: Web-based terminal interface as backup

#### 3. File System Performance
- **Risk**: Large todo lists may cause slow file operations
- **Mitigation**: Implement pagination, lazy loading, and data indexing
- **Alternative**: SQLite database for better performance

#### 4. Memory Management
- **Risk**: Long-running application may accumulate memory leaks
- **Mitigation**: Regular garbage collection, object pooling
- **Alternative**: Restart application periodically

### Mitigation Strategies

#### Development Approach
- Incremental development with frequent testing
- Comprehensive error handling and logging
- User feedback collection and iteration
- Performance monitoring and optimization

#### Quality Assurance
- Automated testing for core functionality
- Manual testing on multiple platforms
- User acceptance testing with real workflows
- Code review and refactoring cycles

### Alternative Approaches

#### Storage Alternatives
- **SQLite**: Better performance for large datasets
- **MongoDB**: Document-based storage for flexibility
- **Cloud Storage**: Remote synchronization capabilities

#### UI Alternatives
- **Web Interface**: Browser-based terminal emulation
- **Desktop App**: Electron-based cross-platform application
- **Mobile App**: React Native for mobile access

#### Architecture Alternatives
- **Microservices**: Separate services for different features
- **Event Sourcing**: Immutable event log for data changes
- **CQRS**: Command Query Responsibility Segregation pattern

---

## Next Steps

This design document provides the foundation for implementing the todo manager. The next phase should focus on creating a detailed implementation plan (`TODO-PLAN.md`) that breaks down the development into manageable phases, starting with the Model layer and progressing through Controller and View implementations.

The design emphasizes user experience, data integrity, and maintainable architecture while providing a rich terminal interface that rivals modern GUI applications.
