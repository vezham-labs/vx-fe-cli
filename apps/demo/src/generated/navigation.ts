// Generated from vx.nav.yaml. DO NOT EDIT.
import type { AppNavigationItem, AppMenuItem } from '@vezham/react'
import type { ControlCenterConfig } from '@vezham/react/control-center'

export const navigationItems = [
  {
    "key": "home",
    "icon": "vx:home",
    "iconActive": "vx:home-filled",
    "href": "/",
    "title": "Home"
  },
  {
    "key": "pro",
    "icon": "vx:library",
    "iconActive": "vx:library-filled",
    "href": "/pro",
    "title": "Pro"
  },
  {
    "key": "canvas",
    "icon": "vx:palette",
    "iconActive": "vx:palette-filled",
    "href": "/canvas",
    "title": "Canvas"
  },
  {
    "key": "tabs",
    "title": "Tabs",
    "icon": "vx:library",
    "iconActive": "vx:library-filled",
    "href": "/tabs/overview",
    "toolbar": {
      "search": true,
      "sync": true,
      "filter": true,
      "sort": true,
      "view": [
        {
          "key": "grid",
          "label": "Grid view",
          "icon": "vx:grid"
        },
        {
          "key": "list",
          "label": "List view",
          "icon": "vx:list"
        }
      ],
      "menuActions": [
        {
          "key": "import",
          "label": "Import",
          "icon": "vx:upload"
        },
        {
          "key": "print",
          "label": "Print",
          "icon": "vx:printer"
        },
        {
          "key": "export",
          "label": "Export",
          "icon": "vx:download",
          "children": [
            {
              "key": "export-pdf",
              "label": "Export as PDF",
              "icon": "vx:file-text"
            },
            {
              "key": "export-excel",
              "label": "Export as Excel",
              "icon": "vx:file-spreadsheet"
            }
          ]
        }
      ],
      "primaryAction": false
    },
    "children": [
      {
        "key": "overview",
        "title": "Overview",
        "href": "/tabs/overview",
        "toolbar": {
          "primaryAction": {
            "key": "create",
            "label": "Add Overview",
            "icon": "vx:plus"
          }
        }
      },
      {
        "key": "activity",
        "title": "Activity",
        "href": "/tabs/activity",
        "toolbar": {
          "primaryAction": {
            "key": "create",
            "label": "Add Activity",
            "icon": "vx:plus"
          }
        }
      }
    ]
  },
  {
    "key": "workspace",
    "title": "Workspace",
    "icon": "vx:library",
    "iconActive": "vx:library-filled",
    "href": "/workspace/projects/overview",
    "toolbar": {
      "search": true,
      "sync": true,
      "filter": true,
      "sort": true,
      "view": [
        {
          "key": "grid",
          "label": "Grid view",
          "icon": "vx:grid"
        },
        {
          "key": "list",
          "label": "List view",
          "icon": "vx:list"
        }
      ],
      "menuActions": [
        {
          "key": "import",
          "label": "Import",
          "icon": "vx:upload"
        },
        {
          "key": "print",
          "label": "Print",
          "icon": "vx:printer"
        },
        {
          "key": "export",
          "label": "Export",
          "icon": "vx:download",
          "children": [
            {
              "key": "export-pdf",
              "label": "Export as PDF",
              "icon": "vx:file-text"
            },
            {
              "key": "export-excel",
              "label": "Export as Excel",
              "icon": "vx:file-spreadsheet"
            }
          ]
        }
      ],
      "primaryAction": false
    },
    "children": [
      {
        "key": "projects",
        "title": "Projects",
        "href": "/workspace/projects/overview",
        "children": [
          {
            "key": "overview",
            "title": "Overview",
            "href": "/workspace/projects/overview",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Overview",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "activity",
            "title": "Activity",
            "href": "/workspace/projects/activity",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Activity",
                "icon": "vx:plus"
              }
            }
          }
        ]
      },
      {
        "key": "team",
        "title": "Team",
        "href": "/workspace/team/members",
        "children": [
          {
            "key": "members",
            "title": "Members",
            "href": "/workspace/team/members",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Members",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "roles",
            "title": "Roles",
            "href": "/workspace/team/roles",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Roles",
                "icon": "vx:plus"
              }
            }
          }
        ]
      }
    ]
  },
  {
    "key": "academic",
    "icon": "vx:library",
    "iconActive": "vx:library-filled",
    "href": "/academic",
    "title": "Academic",
    "toolbar": {
      "search": true,
      "sync": true,
      "filter": true,
      "sort": true,
      "view": [
        {
          "key": "grid",
          "label": "Grid view",
          "icon": "vx:grid"
        },
        {
          "key": "list",
          "label": "List view",
          "icon": "vx:list"
        }
      ],
      "menuActions": [
        {
          "key": "import",
          "label": "Import",
          "icon": "vx:upload"
        },
        {
          "key": "print",
          "label": "Print",
          "icon": "vx:printer"
        },
        {
          "key": "export",
          "label": "Export",
          "icon": "vx:download",
          "children": [
            {
              "key": "export-pdf",
              "label": "Export as PDF",
              "icon": "vx:file-text"
            },
            {
              "key": "export-excel",
              "label": "Export as Excel",
              "icon": "vx:file-spreadsheet"
            }
          ]
        }
      ],
      "primaryAction": false
    },
    "children": [
      {
        "key": "classes",
        "title": "Classes",
        "href": "/academic/classes",
        "icon": "vx:book-open",
        "children": [
          {
            "key": "allclasses",
            "title": "All Classes",
            "href": "/academic/classes/allclasses",
            "icon": "vx:list",
            "toolbar": {
              "filter": false,
              "sort": false,
              "primaryAction": {
                "key": "create",
                "label": "Add Class",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "schedule",
            "title": "Schedule",
            "href": "/academic/classes/schedule",
            "icon": "vx:calendar-clock",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Schedule",
                "icon": "vx:plus"
              }
            }
          }
        ]
      },
      {
        "key": "classroom",
        "title": "Class Room",
        "href": "/academic/classroom",
        "icon": "vx:grid",
        "toolbar": {
          "primaryAction": {
            "key": "create",
            "label": "Add Classroom",
            "icon": "vx:plus"
          }
        }
      },
      {
        "key": "classroutine",
        "title": "Class Routine",
        "href": "/academic/class-routine",
        "icon": "vx:calendar-days",
        "toolbar": {
          "primaryAction": {
            "key": "create",
            "label": "Add Class Routine",
            "icon": "vx:plus"
          }
        }
      },
      {
        "key": "section",
        "title": "Section",
        "href": "/academic/section",
        "icon": "vx:sidebar",
        "toolbar": {
          "primaryAction": {
            "key": "create",
            "label": "Add Section",
            "icon": "vx:plus"
          }
        }
      },
      {
        "key": "subject",
        "title": "Subject",
        "href": "/academic/subject",
        "icon": "vx:book",
        "toolbar": {
          "primaryAction": {
            "key": "create",
            "label": "Add Subject",
            "icon": "vx:plus"
          }
        }
      },
      {
        "key": "syllabus",
        "title": "Syllabus",
        "href": "/academic/syllabus",
        "icon": "vx:file-text",
        "toolbar": {
          "primaryAction": {
            "key": "create",
            "label": "Add Subject Group",
            "icon": "vx:plus"
          }
        }
      },
      {
        "key": "timetable",
        "title": "Time Table",
        "href": "/academic/timetable",
        "icon": "vx:clock",
        "toolbar": {
          "primaryAction": {
            "key": "create",
            "label": "Add Timetable",
            "icon": "vx:plus"
          }
        }
      },
      {
        "key": "homework",
        "title": "Home Work",
        "href": "/academic/homework",
        "icon": "vx:clipboard-list",
        "toolbar": {
          "primaryAction": {
            "key": "create",
            "label": "Add Homework",
            "icon": "vx:plus"
          }
        }
      },
      {
        "key": "examinations",
        "title": "Examinations",
        "childrenDisplay": "sidebar",
        "href": "/academic/examinations",
        "icon": "vx:academic-cap",
        "children": [
          {
            "key": "exam",
            "title": "Exam",
            "href": "/academic/examinations/exam",
            "icon": "vx:document-edit",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Exam",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "exam-schedule",
            "title": "Exam Schedule",
            "href": "/academic/examinations/exam-schedule",
            "icon": "vx:calendar-check",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Exam Schedule",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "grades",
            "title": "Grades",
            "href": "/academic/examinations/grades",
            "icon": "vx:verified",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Grades",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "exam-attendance",
            "title": "Exam Attendance",
            "href": "/academic/examinations/exam-attendance",
            "icon": "vx:user-check",
            "toolbar": {
              "primaryAction": false
            }
          },
          {
            "key": "exam-results",
            "title": "Exam Results",
            "href": "/academic/examinations/exam-results",
            "icon": "vx:chart",
            "toolbar": {
              "primaryAction": false
            }
          }
        ]
      },
      {
        "key": "reasons",
        "title": "Reasons",
        "href": "/academic/reasons",
        "icon": "vx:help",
        "toolbar": {
          "primaryAction": {
            "key": "create",
            "label": "Add Reactions",
            "icon": "vx:plus"
          }
        }
      }
    ]
  },
  {
    "key": "operations",
    "icon": "vx:box",
    "iconActive": "vx:box-filled",
    "href": "/operations",
    "title": "Operations",
    "toolbar": {
      "search": true,
      "sync": true,
      "filter": true,
      "sort": true,
      "view": [
        {
          "key": "grid",
          "label": "Grid view",
          "icon": "vx:grid"
        },
        {
          "key": "list",
          "label": "List view",
          "icon": "vx:list"
        }
      ],
      "menuActions": [
        {
          "key": "import",
          "label": "Import",
          "icon": "vx:upload"
        },
        {
          "key": "print",
          "label": "Print",
          "icon": "vx:printer"
        },
        {
          "key": "export",
          "label": "Export",
          "icon": "vx:download",
          "children": [
            {
              "key": "export-pdf",
              "label": "Export as PDF",
              "icon": "vx:file-text"
            },
            {
              "key": "export-excel",
              "label": "Export as Excel",
              "icon": "vx:file-spreadsheet"
            }
          ]
        }
      ],
      "primaryAction": false
    },
    "children": [
      {
        "key": "fees",
        "title": "Fees Collections",
        "href": "/operations/fees",
        "icon": "vx:calendar-check",
        "children": [
          {
            "key": "fees-group",
            "title": "Fees Group",
            "href": "/operations/fees/fees-group",
            "icon": "vx:report",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Fees Group",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "fees-type",
            "title": "Fees Type",
            "href": "/operations/fees/fees-type",
            "icon": "vx:user-round-check",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Fees Type",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "fees-master",
            "title": "Fees Master",
            "href": "/operations/fees/fees-master",
            "icon": "vx:calendar-days",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Fees Master",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "fees-assign",
            "title": "Fees Assign",
            "href": "/operations/fees/fees-assign",
            "icon": "vx:user",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Assign New",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "collect-fees",
            "title": "Collect Fees",
            "href": "/operations/fees/collect-fees",
            "icon": "vx:academic-cap",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Collect Fees",
                "icon": "vx:plus"
              }
            }
          }
        ]
      },
      {
        "key": "library",
        "title": "Library",
        "href": "/operations/library",
        "icon": "vx:school",
        "children": [
          {
            "key": "members",
            "title": "Library Members",
            "href": "/operations/library/members",
            "icon": "vx:report",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Member",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "books",
            "title": "Books",
            "href": "/operations/library/books",
            "icon": "vx:user-round-check",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Book",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "issue-book",
            "title": "Issue Book",
            "href": "/operations/library/issue-book",
            "icon": "vx:calendar-days",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Issue Book",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "return",
            "title": "Return",
            "href": "/operations/library/return",
            "icon": "vx:user",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Return Book",
                "icon": "vx:plus"
              }
            }
          }
        ]
      },
      {
        "key": "sports",
        "title": "Sports",
        "href": "/operations/sports",
        "icon": "vx:users",
        "toolbar": {
          "primaryAction": {
            "key": "create",
            "label": "Add Sport",
            "icon": "vx:plus"
          }
        }
      },
      {
        "key": "players",
        "title": "Players",
        "href": "/operations/players",
        "icon": "vx:users",
        "toolbar": {
          "primaryAction": {
            "key": "create",
            "label": "Add Players",
            "icon": "vx:plus"
          }
        }
      },
      {
        "key": "hostel",
        "title": "Hostel",
        "href": "/operations/hostel",
        "icon": "vx:verified",
        "children": [
          {
            "key": "hostel-list",
            "title": "Hostel List",
            "href": "/operations/hostel/hostel-list",
            "icon": "vx:report",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Hostel",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "hostel-room",
            "title": "Hostel Room",
            "href": "/operations/hostel/hostel-room",
            "icon": "vx:user-round-check",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Hostel Rooms",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "room-type",
            "title": "Room Type",
            "href": "/operations/hostel/room-type",
            "icon": "vx:calendar-days",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Room Type",
                "icon": "vx:plus"
              }
            }
          }
        ]
      },
      {
        "key": "transport",
        "title": "Transport",
        "href": "/operations/transport",
        "icon": "vx:calendar-minus",
        "children": [
          {
            "key": "routes",
            "title": "Routes",
            "href": "/operations/transport/routes",
            "icon": "vx:report",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Route",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "pickup-points",
            "title": "Pickup points",
            "href": "/operations/transport/pickup-points",
            "icon": "vx:user-round-check",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Pickup Points",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "vehicle-drivers",
            "title": "Vehicle Drivers",
            "href": "/operations/transport/vehicle-drivers",
            "icon": "vx:calendar-days",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Drivers",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "vehicles",
            "title": "Vehicles",
            "href": "/operations/transport/vehicles",
            "icon": "vx:user-round-check",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Add Vehicle",
                "icon": "vx:plus"
              }
            }
          },
          {
            "key": "assign",
            "title": "Assign Vehicles",
            "href": "/operations/transport/assign",
            "icon": "vx:calendar-days",
            "toolbar": {
              "primaryAction": {
                "key": "create",
                "label": "Assign New Vehicle",
                "icon": "vx:plus"
              }
            }
          }
        ]
      }
    ]
  },
  {
    "key": "reports",
    "icon": "vx:chart",
    "iconActive": "vx:chart-filled",
    "href": "/reports",
    "title": "Reports",
    "toolbar": {
      "search": true,
      "sync": true,
      "filter": true,
      "sort": true,
      "view": [
        {
          "key": "grid",
          "label": "Grid view",
          "icon": "vx:grid"
        },
        {
          "key": "list",
          "label": "List view",
          "icon": "vx:list"
        }
      ],
      "menuActions": [
        {
          "key": "import",
          "label": "Import",
          "icon": "vx:upload"
        },
        {
          "key": "print",
          "label": "Print",
          "icon": "vx:printer"
        },
        {
          "key": "export",
          "label": "Export",
          "icon": "vx:download",
          "children": [
            {
              "key": "export-pdf",
              "label": "Export as PDF",
              "icon": "vx:file-text"
            },
            {
              "key": "export-excel",
              "label": "Export as Excel",
              "icon": "vx:file-spreadsheet"
            }
          ]
        }
      ],
      "primaryAction": false
    },
    "children": [
      {
        "key": "attendance",
        "title": "Attendance Reports",
        "href": "/reports/attendance",
        "icon": "vx:calendar-check",
        "children": [
          {
            "key": "attendance-report",
            "title": "Attendance Report",
            "href": "/reports/attendance/attendance-report",
            "icon": "vx:report"
          },
          {
            "key": "students-attendance-type",
            "title": "Students Attendance Type",
            "href": "/reports/attendance/students-attendance-type",
            "icon": "vx:user-round-check"
          },
          {
            "key": "daily-attendance",
            "title": "Daily Attendance",
            "href": "/reports/attendance/daily-attendance",
            "icon": "vx:calendar-days"
          },
          {
            "key": "student-day-wise",
            "title": "Student Day Wise",
            "href": "/reports/attendance/student-day-wise",
            "icon": "vx:user"
          },
          {
            "key": "teacher-day-wise",
            "title": "Teacher Day Wise",
            "href": "/reports/attendance/teacher-day-wise",
            "icon": "vx:academic-cap"
          },
          {
            "key": "staff-day-wise",
            "title": "Staff Day Wise",
            "href": "/reports/attendance/staff-day-wise",
            "icon": "vx:briefcase"
          },
          {
            "key": "teacher-report",
            "title": "Teacher Report",
            "href": "/reports/attendance/teacher-report",
            "icon": "vx:clipboard-list"
          },
          {
            "key": "staff-report",
            "title": "Staff Report",
            "href": "/reports/attendance/staff-report",
            "icon": "vx:clipboard-list"
          }
        ]
      },
      {
        "key": "class",
        "title": "Class Reports",
        "href": "/reports/class",
        "icon": "vx:school"
      },
      {
        "key": "student",
        "title": "Student Reports",
        "href": "/reports/student",
        "icon": "vx:users"
      },
      {
        "key": "grade",
        "title": "Grade Reports",
        "href": "/reports/grade",
        "icon": "vx:verified"
      },
      {
        "key": "leave",
        "title": "Leave Reports",
        "href": "/reports/leave",
        "icon": "vx:calendar-minus"
      },
      {
        "key": "fees",
        "title": "Fees Reports",
        "href": "/reports/fees",
        "icon": "vx:receipt"
      }
    ]
  }
] satisfies AppNavigationItem[]

export const appMenu = [
  {
    "key": "file",
    "label": "File",
    "groups": [
      [
        {
          "key": "file.new",
          "label": "New…",
          "shortcut": "Mod N"
        },
        {
          "key": "file.open",
          "label": "Open…",
          "shortcut": "Mod O"
        }
      ],
      [
        {
          "key": "file.save",
          "label": "Save",
          "shortcut": "Mod S"
        },
        {
          "key": "file.save-as",
          "label": "Save As…",
          "shortcut": "⇧ Mod S"
        }
      ],
      [
        {
          "key": "file.import",
          "label": "Import…"
        },
        {
          "key": "file.export",
          "label": "Export…"
        }
      ],
      [
        {
          "key": "file.print",
          "label": "Print…",
          "shortcut": "Mod P"
        }
      ]
    ]
  },
  {
    "key": "edit",
    "label": "Edit",
    "groups": [
      [
        {
          "key": "edit.undo",
          "label": "Undo",
          "shortcut": "Mod Z"
        },
        {
          "key": "edit.redo",
          "label": "Redo",
          "shortcut": "⇧ Mod Z"
        }
      ],
      [
        {
          "key": "edit.cut",
          "label": "Cut",
          "shortcut": "Mod X"
        },
        {
          "key": "edit.copy",
          "label": "Copy",
          "shortcut": "Mod C"
        },
        {
          "key": "edit.paste",
          "label": "Paste",
          "shortcut": "Mod V"
        },
        {
          "key": "edit.select-all",
          "label": "Select All",
          "shortcut": "Mod A"
        }
      ],
      [
        {
          "key": "edit.find",
          "label": "Find…",
          "shortcut": "Mod F"
        }
      ]
    ]
  },
  {
    "key": "view",
    "label": "View",
    "groups": [
      [
        {
          "key": "view.zoom-in",
          "label": "Zoom In",
          "shortcut": "Mod +"
        },
        {
          "key": "view.zoom-out",
          "label": "Zoom Out",
          "shortcut": "Mod -"
        },
        {
          "key": "view.actual-size",
          "label": "Actual Size",
          "shortcut": "Mod 0"
        }
      ],
      [
        {
          "key": "view.full-screen",
          "label": "Enter Full Screen"
        }
      ]
    ]
  },
  {
    "key": "help",
    "label": "Help",
    "groups": [
      [
        {
          "key": "help.app-help",
          "label": "App Help"
        },
        {
          "key": "help.keyboard-shortcuts",
          "label": "Keyboard Shortcuts"
        }
      ],
      [
        {
          "key": "help.report-issue",
          "label": "Report an Issue…"
        },
        {
          "key": "help.send-feedback",
          "label": "Send Feedback…"
        }
      ]
    ]
  }
] satisfies AppMenuItem[]

export const controlCenter = {
  "editControls": true,
  "tiles": [
    {
      "id": "appearance-toggle",
      "type": "appearance-toggle",
      "span": "compact"
    },
    {
      "id": "theme",
      "type": "theme",
      "span": "wide"
    },
    {
      "id": "direction-toggle",
      "type": "direction-toggle",
      "span": "compact"
    },
    {
      "id": "language",
      "type": "language",
      "span": "wide"
    },
    {
      "id": "direction",
      "type": "direction",
      "span": "wide"
    },
    {
      "id": "display",
      "type": "preview-display",
      "span": "full"
    },
    {
      "id": "sound",
      "type": "preview-sound",
      "span": "full"
    },
    {
      "id": "media",
      "type": "preview-media",
      "span": "full"
    },
    {
      "id": "wifi",
      "type": "preview-wifi",
      "span": "wide"
    },
    {
      "id": "bluetooth",
      "type": "preview-bluetooth",
      "span": "wide"
    },
    {
      "id": "airdrop",
      "type": "preview-airdrop",
      "span": "wide"
    },
    {
      "id": "focus",
      "type": "preview-focus",
      "span": "full"
    },
    {
      "id": "stage-manager",
      "type": "preview-stage-manager",
      "span": "wide"
    },
    {
      "id": "mirroring",
      "type": "preview-mirroring",
      "span": "full"
    },
    {
      "id": "demo-appearance-lite",
      "type": "appearance-toggle",
      "span": "compact"
    },
    {
      "id": "demo-appearance",
      "type": "appearance",
      "span": "wide"
    },
    {
      "id": "appearance-wide",
      "type": "appearance",
      "span": "wide"
    },
    {
      "id": "appearance-lite1",
      "type": "appearance-toggle",
      "span": "compact"
    },
    {
      "id": "appearance-23",
      "type": "appearance",
      "span": "standard"
    },
    {
      "id": "appearance-12",
      "type": "appearance",
      "span": "full"
    },
    {
      "id": "appearance-lite2",
      "type": "appearance-toggle",
      "span": "compact"
    },
    {
      "id": "appearance-lite3",
      "type": "appearance-toggle",
      "span": "compact"
    },
    {
      "id": "appearance-lite4",
      "type": "appearance-toggle",
      "span": "compact"
    },
    {
      "id": "appearance-lite5",
      "type": "appearance-toggle",
      "span": "compact"
    }
  ]
} satisfies ControlCenterConfig

export const getNavigationChildren = (key: string) => {
  const items: readonly AppNavigationItem[] = navigationItems
  const item = items.find(item => item.key === key)
  if (!item) {
    throw new Error('Unknown navigation key: ' + key)
  }
  return 'children' in item && Array.isArray(item.children) ? item.children : []
}
