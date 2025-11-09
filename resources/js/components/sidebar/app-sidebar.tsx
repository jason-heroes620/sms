import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import {
    Banknote,
    BookOpen,
    Calendar,
    ChevronRight,
    LayoutDashboard,
    MonitorCog,
    Newspaper,
    NotebookPen,
    PencilRuler,
    School,
    User,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';

type SubItem = {
    key: string;
    label: string;
    href: string;
};

type GroupItem = {
    key: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    href: string;
    subItems: SubItem[];
};

type ItemGroup = {
    group: string;
    groupItems: GroupItem[];
};

const items = [
    {
        group: 'General',
        groupItems: [
            {
                key: 'classes',
                label: 'Classes',
                icon: PencilRuler,
                href: '/classes',
                subItems: [
                    {
                        key: 'all-classes',
                        label: 'All Classes',
                        href: '/classes',
                    },
                    {
                        key: 'new-class',
                        label: 'New Class',
                        href: '/classes/create',
                    },
                    {
                        key: 'classes-view',
                        label: '',
                        href: '/classes/:id',
                    },
                ],
            },
            {
                key: 'sections',
                label: 'Sections',
                icon: PencilRuler,
                href: '/sections',
                subItems: [
                    {
                        key: 'all-sections',
                        label: 'All Sections',
                        href: '/sections',
                    },
                    {
                        key: 'new-section',
                        label: 'New Section',
                        href: '/sections/create',
                    },
                ],
            },
            {
                key: 'students',
                label: 'Students',
                icon: User,
                href: '/students',
                subItems: [
                    {
                        key: 'all-students',
                        label: 'All Students',
                        href: '/students',
                    },
                    {
                        key: 'new-admission',
                        label: 'New Admission',
                        href: '/student/create',
                    },
                    {
                        key: 'attendance',
                        label: 'Attendance',
                        href: '/student/attendance',
                    },
                    // {
                    //     key: 'student-promotion',
                    //     label: 'Student Promotion',
                    //     href: '/student-promotion',
                    // },
                    {
                        key: 'student-view',
                        label: '',
                        href: '/students/:id',
                    },
                ],
            },
            {
                key: 'subjects',
                label: 'Subjects',
                icon: BookOpen,
                href: '/subjects',
                subItems: [
                    {
                        key: 'all-subjects',
                        label: 'All Subjects',
                        href: '/subjects',
                    },
                    {
                        key: 'new-subject',
                        label: 'New Subject',
                        href: '/subjects/create',
                    },
                    // {
                    //     key: 'subject-classes',
                    //     label: 'Assign Subject',
                    //     href: '/subject-classes',
                    // },
                    {
                        key: 'subject-view',
                        label: '',
                        href: '/subjects/:id',
                    },
                ],
            },
            {
                key: 'timetable',
                label: 'Timetable',
                icon: Calendar,
                href: '/timetable',
                subItems: [
                    {
                        key: 'timetable',
                        label: 'Timetable',
                        href: '/timetable',
                    },
                    {
                        key: 'new-class-schedule',
                        label: 'New Class Schedule',
                        href: '/timetable/create',
                    },
                ],
            },
            {
                key: 'homework',
                label: 'Homework',
                icon: NotebookPen,
                href: '/homeworks',
                subItems: [
                    {
                        key: 'all-homework',
                        label: 'All Homework',
                        href: '/homeworks',
                    },
                    {
                        key: 'add-homework',
                        label: 'Add Homework',
                        href: '/homework/create',
                    },
                    // {
                    //     key: 'submissions',
                    //     label: 'Submissions',
                    //     href: '/homework-submissions',
                    // },
                    {
                        key: 'submissions',
                        label: '',
                        href: '/homeworks/submissions/:id',
                    },
                    {
                        key: 'homework-view',
                        label: '',
                        href: '/homeworks/:id',
                    },
                ],
            },
            {
                key: 'exams',
                label: 'Exams',
                icon: NotebookPen,
                href: '/exams',
                subItems: [
                    {
                        key: 'all-exams',
                        label: 'All Exams',
                        href: '/exams',
                    },
                    {
                        key: 'add-exam',
                        label: 'Add Exam',
                        href: '/exams/create',
                    },
                    // {
                    //     key: 'exam-results',
                    //     label: 'Exam Results',
                    //     href: '/exam_results',
                    // },
                    {
                        key: 'exam-view',
                        label: '',
                        href: '/exams/:id',
                    },
                    {
                        key: 'exam-results',
                        label: '',
                        href: '/exams/results/:id',
                    },
                ],
            },
            {
                key: 'assessments',
                label: 'Assessments',
                icon: NotebookPen,
                href: '/assessments',
                subItems: [
                    {
                        key: 'assessments',
                        label: 'All Assessments',
                        href: '/assessments',
                    },
                    {
                        key: 'new-assessments',
                        label: 'New Assessments',
                        href: '/assessment/create',
                    },
                    {
                        key: 'view-assessments',
                        label: '',
                        href: '/assessments/:id',
                    },
                ],
            },
            // {
            //     key: 'reports',
            //     label: 'Reports',
            //     icon: NotepadText,
            //     href: '/reports',
            //     subItems: [
            //         {
            //             key: 'report-student-attendance',
            //             label: 'Student Attendance',
            //             href: '/reports/student-attendance',
            //         },
            //         {
            //             key: 'report-student-assessment',
            //             label: 'Student Assessment',
            //             href: '/reports/student-assessment',
            //         },
            //     ],
            // },
            {
                key: 'announcements',
                label: 'Announcements',
                icon: Newspaper,
                href: '/announcements',
                subItems: [
                    {
                        key: 'announcements',
                        label: 'All Announcements',
                        href: '/announcements',
                    },
                    {
                        key: 'add-announcement',
                        label: 'Add Announcement',
                        href: '/announcement/create',
                    },
                ],
            },
        ],
    },
    {
        group: 'Billing',
        groupItems: [
            {
                key: 'billing',
                label: 'Billing',
                icon: Banknote,
                href: '/billings',
                subItems: [],
            },
            {
                key: 'invoices',
                label: 'Invoices',
                icon: Banknote,
                href: '/invoices',
                subItems: [
                    {
                        key: 'all-invoices',
                        label: 'Invoices',
                        href: '/invoices',
                    },
                    {
                        key: 'invoice',
                        label: '',
                        href: '/invoices/:id',
                    },
                ],
            },

            // {
            //     key: 'receipts',
            //     label: 'Receipts',
            //     icon: Receipt,
            //     href: '/receipts',
            //     subItems: [],
            // },
        ],
    },
    {
        group: 'Settings',
        groupItems: [
            {
                key: 'school_profile',
                label: 'School Profile',
                icon: School,
                href: '/school_profile',
                subItems: [
                    {
                        key: 'branch',
                        label: 'Branches',
                        href: '/branches',
                    },
                ],
            },
            {
                key: 'academic_year',
                label: 'Academic Year',
                icon: Calendar,
                href: '/academic_years/create',
                subItems: [],
            },
            {
                key: 'fees',
                label: 'Fees & Packages',
                icon: Banknote,
                href: '/fees',
                subItems: [
                    {
                        key: 'fees',
                        label: 'Fees',
                        href: '/fees',
                        subItems: [],
                    },
                    {
                        key: 'packages',
                        label: 'Packages',
                        href: '/packages',
                        subItems: [],
                    },
                    {
                        key: 'new_packages',
                        label: 'New Package',
                        href: '/packages/create',
                        subItems: [],
                    },
                ],
            },
            {
                key: 'grades',
                label: 'Grades',
                icon: BookOpen,
                href: '/grades',
                subItems: [],
            },
            {
                key: 'users',
                label: 'Manage Users',
                icon: Users,
                href: '/users',
                subItems: [
                    {
                        key: 'all-users',
                        label: 'Users',
                        href: '/users',
                    },
                    {
                        key: 'new-users',
                        label: 'New User',
                        href: '/users/create',
                    },
                    {
                        key: 'positions',
                        label: 'Positions',
                        href: '/positions',
                    },
                    {
                        key: 'user-view',
                        label: '',
                        href: '/users/:id',
                    },
                ],
            },
            {
                key: 'roles',
                label: 'Roles & Permissions',
                icon: User,
                href: '/roles',
                subItems: [
                    {
                        key: 'all-roles',
                        label: 'Roles',
                        href: '/roles',
                    },
                ],
            },
            {
                key: 'integration',
                label: 'Integrations',
                icon: MonitorCog,
                href: '/integrations',
                subItems: [],
            },
        ],
    },
];
export function AppSidebar() {
    const { state, isMobile } = useSidebar();
    const { url, props } = usePage();
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
        {},
    );

    const pathname = window.location.pathname ?? '/';

    // 2. Create a ref to attach to the active element
    const activeItemRef = useRef<HTMLAnchorElement>(null);

    // 3. Effect hook to handle the scrolling
    useEffect(() => {
        // Check if the ref is attached to an element
        if (activeItemRef.current) {
            // Use the native scrollIntoView method
            activeItemRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest', // Scrolls the element into the nearest visible area
            });
        }
    }, [pathname]);

    useEffect(() => {
        const initialExpanded: Record<string, boolean> = {};

        items.forEach((group) => {
            group.groupItems.forEach((item) => {
                const isActive =
                    url === item.href ||
                    url.startsWith(item.href + '/') ||
                    item.subItems.some(
                        (subItem) =>
                            url === subItem.href ||
                            (subItem.href.includes('/:') &&
                                url.startsWith(subItem.href.split('/:')[0])),
                    );

                if (isActive) {
                    initialExpanded[item.key] = true;
                }
            });
        });

        setExpandedItems(initialExpanded);
    }, [url]);

    const toggleExpand = (key: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const isActive = (href: string) => {
        // console.log(url, href, url.startsWith(href.slice(0, -1)));
        return (
            url === href ||
            (href !== '/' && url.startsWith(href + '/')) ||
            (href.endsWith('/') && url.startsWith(href.slice(0, -1)))
            // url.startsWith(href.slice(0, -1))
        );
    };

    return (
        <ScrollArea>
            <Sidebar side="left" collapsible="icon" variant="sidebar">
                <div className="flex h-16 w-auto p-2">
                    <img
                        src="/img/heroesCampus.jpg"
                        alt=""
                        className="object-contain"
                    />
                </div>
                <SidebarContent className="pt-4 md:pt-2">
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem key={'dashboard'}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={'Dashboard'}
                                        isActive={url === '/dashboard'}
                                    >
                                        <Link href={'/dashboard'}>
                                            <LayoutDashboard />
                                            Dashboard
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    {items.map((item) => {
                        return (
                            <SidebarGroup key={item.group}>
                                <SidebarGroupLabel>
                                    {item.group}
                                </SidebarGroupLabel>
                                {item.groupItems.map((groupItem) => {
                                    return (
                                        <SidebarMenu key={groupItem.key}>
                                            {groupItem.subItems.length > 0 ? (
                                                <Collapsible
                                                    className="group/collapsible"
                                                    defaultOpen={
                                                        groupItem.subItems &&
                                                        groupItem.subItems.some(
                                                            (g: SubItem) =>
                                                                isActive(
                                                                    g.href,
                                                                ),
                                                        )
                                                    }
                                                >
                                                    <CollapsibleTrigger asChild>
                                                        <SidebarMenuItem>
                                                            <SidebarMenuButton
                                                                tooltip={
                                                                    groupItem.label
                                                                }
                                                                isActive={groupItem.subItems.some(
                                                                    (g) =>
                                                                        isActive(
                                                                            g.href,
                                                                        ),
                                                                )}
                                                            >
                                                                <groupItem.icon />
                                                                {
                                                                    groupItem.label
                                                                }
                                                                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    </CollapsibleTrigger>

                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {groupItem.subItems.map(
                                                                (subItem) => {
                                                                    return (
                                                                        subItem.label !==
                                                                            '' && (
                                                                            <SidebarMenuSubItem
                                                                                key={
                                                                                    subItem.key
                                                                                }
                                                                            >
                                                                                <SidebarMenuSubButton
                                                                                    asChild
                                                                                    isActive={
                                                                                        url ===
                                                                                        subItem.href
                                                                                    }
                                                                                    ref={
                                                                                        url ===
                                                                                        subItem.href
                                                                                            ? activeItemRef
                                                                                            : null
                                                                                    }
                                                                                >
                                                                                    <Link
                                                                                        href={
                                                                                            subItem.href
                                                                                        }
                                                                                    >
                                                                                        <span>
                                                                                            {
                                                                                                subItem.label
                                                                                            }
                                                                                        </span>
                                                                                    </Link>
                                                                                </SidebarMenuSubButton>
                                                                            </SidebarMenuSubItem>
                                                                        )
                                                                    );
                                                                },
                                                            )}
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            ) : (
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton
                                                        asChild
                                                        tooltip={
                                                            groupItem.label
                                                        }
                                                        isActive={
                                                            url ===
                                                            groupItem.href
                                                        }
                                                    >
                                                        <Link
                                                            ref={
                                                                url ===
                                                                groupItem.href
                                                                    ? activeItemRef
                                                                    : null
                                                            }
                                                            href={
                                                                groupItem.href
                                                            }
                                                        >
                                                            <groupItem.icon />
                                                            {groupItem.label}
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            )}
                                        </SidebarMenu>
                                    );
                                })}
                            </SidebarGroup>
                        );
                    })}
                </SidebarContent>
                <SidebarFooter>
                    {state === 'expanded' && (
                        <div className="flex justify-center">
                            <span className="text-[10px]">
                                &copy; HEROES Malaysia
                            </span>
                        </div>
                    )}
                </SidebarFooter>
            </Sidebar>
        </ScrollArea>
    );
}
