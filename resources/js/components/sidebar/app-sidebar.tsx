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
    Newspaper,
    NotebookPen,
    NotepadText,
    PencilRuler,
    School,
    User,
    Users,
} from 'lucide-react';

const items = [
    {
        group: 'General',
        groupItems: [
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
                        key: 'add-student',
                        label: 'Add Student',
                        href: '/student/create',
                    },
                    {
                        key: 'attendance',
                        label: 'Attendance',
                        href: '/attendance',
                    },
                ],
            },
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
                        key: 'add-class',
                        label: 'Add Class',
                        href: '/class/create',
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
                        key: 'add-subject',
                        label: 'Add Subject',
                        href: '/subject/create',
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
                        key: 'all-timetables',
                        label: 'All Timetables',
                        href: '/timetables',
                    },
                    {
                        key: 'add-timetable',
                        label: 'Add Timetable',
                        href: '/timetable/create',
                    },
                ],
            },
            {
                key: 'homework',
                label: 'Homework',
                icon: NotebookPen,
                href: '/homework',
                subItems: [
                    {
                        key: 'all-homework',
                        label: 'All Homework',
                        href: '/homework',
                    },
                    {
                        key: 'add-homework',
                        label: 'Add Homework',
                        href: '/homework/create',
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
                        href: '/exam/create',
                    },
                ],
            },
            {
                key: 'assessments',
                label: 'Assessments',
                icon: NotebookPen,
                href: '/assessments',
                subItems: [],
            },
            {
                key: 'reports',
                label: 'Reports',
                icon: NotepadText,
                href: '/reports',
                subItems: [],
            },
            {
                key: 'announcements',
                label: 'Announcements',
                icon: Newspaper,
                href: '/announcements',
                subItems: [],
            },
        ],
    },
    {
        group: 'HR',
        groupItems: [
            {
                key: 'employee',
                label: 'Employees',
                icon: Users,
                href: '/employee',
                subItems: [
                    {
                        key: 'all-employees',
                        label: 'All Employees',
                        href: '/employees',
                    },
                    {
                        key: 'add-employee',
                        label: 'Add Employee',
                        href: '/employee/add',
                    },
                ],
            },
        ],
    },
    {
        group: 'Settings',
        groupItems: [
            {
                key: 'school_profile',
                label: 'School Profile',
                icon: School,
                href: '/settings/school_profile',
                subItems: [],
            },
            {
                key: 'academic_year',
                label: 'Academic Year',
                icon: Calendar,
                href: '/settings/academic_year/create',
                subItems: [],
            },
            {
                key: 'fees',
                label: 'Fees & Charges',
                icon: Banknote,
                href: '/settings/fees',
                subItems: [],
            },
            {
                key: 'users',
                label: 'Manage Users',
                icon: Users,
                href: '/settings/users',
                subItems: [
                    {
                        key: 'roles',
                        label: 'Roles',
                        href: '/settings/users/roles',
                    },
                    {
                        key: 'permissions',
                        label: 'Permissions',
                        href: '/settings/users/permissions',
                    },
                ],
            },
        ],
    },
];
export function AppSidebar() {
    const { state, isMobile } = useSidebar();
    const { url, props } = usePage();

    return (
        <Sidebar side="left" collapsible="icon" variant="sidebar">
            <SidebarContent className="pt-4 md:pt-10">
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
                            <SidebarGroupLabel>{item.group}</SidebarGroupLabel>
                            {item.groupItems.map((groupItem) => {
                                return (
                                    <SidebarMenu key={groupItem.key}>
                                        {groupItem.subItems.length > 0 ? (
                                            <Collapsible
                                                className="group/collapsible"
                                                defaultOpen={
                                                    groupItem.subItems &&
                                                    groupItem.subItems.some(
                                                        (g) => g.href === url,
                                                    )
                                                        ? true
                                                        : false
                                                }
                                            >
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuItem>
                                                        <SidebarMenuButton
                                                            tooltip={
                                                                groupItem.label
                                                            }
                                                            isActive={
                                                                groupItem.subItems.some(
                                                                    (g) =>
                                                                        g.href ===
                                                                        url,
                                                                )
                                                                    ? true
                                                                    : false
                                                            }
                                                        >
                                                            <groupItem.icon />
                                                            {groupItem.label}
                                                            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                </CollapsibleTrigger>

                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {groupItem.subItems.map(
                                                            (subItem) => {
                                                                return (
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
                                                    tooltip={groupItem.label}
                                                    isActive={
                                                        url === groupItem.href
                                                    }
                                                >
                                                    <Link href={groupItem.href}>
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
    );
}
