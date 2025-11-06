import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import { useAuthStore } from '../stores/authStore'

// Main views
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

// Admin views
import Companies from '../views/admin/Companies.vue'
import Instructors from '../views/admin/Instructors.vue'
import Apprentices from '../views/admin/Apprentices.vue'
import Documents from '../views/admin/Documents.vue'
import Groups from '../views/admin/Groups.vue'
import Parameters from '../views/admin/Parameters.vue'
import Reports from '../views/admin/Reports.vue'
import ValidateRequests from '../views/admin/ValidateRequests.vue'
import AdminNews from '../views/admin/AdminNews.vue'
import ProductiveStageModalities from '../views/admin/ProductiveStageModalities.vue'
import ProductiveStageRegistrations from '../views/admin/ProductiveStageRegistrations.vue'
import SearchGroup from '../views/admin/SearchGroup.vue'
import DocumentsView from '../views/admin/DocumentsView.vue'
import ApprenticeDocumentsDetail from '../views/admin/ApprenticeDocumentsDetail.vue'

// Admin parameters
import Alerts from '../views/admin/parametros/Alerts.vue'
import Emails from '../views/admin/parametros/Emails.vue'
import Storage from '../views/admin/parametros/Storage.vue'
import InstructorHours from '../views/admin/parametros/InstructorHours.vue'
import TrainingProcess from '../views/admin/parametros/TrainingProcess.vue'
import Security from '../views/admin/parametros/Security.vue'
import Templates from '../views/admin/parametros/Templates.vue'

// Admin reports
import HoursByInstructor from '../views/admin/reportes/HoursByInstructor.vue'
import ReportByYear from '../views/admin/reportes/ReportByYear.vue'
import ReportByCompany from '../views/admin/reportes/ReportByCompany.vue'
import ReportByModality from '../views/admin/reportes/ReportByModality.vue'
import ReportByYearView from '../views/admin/reportes/ReportByYearView.vue'
import ReportByCompanyView from '../views/admin/reportes/ReportByCompanyView.vue'
import ReportByModalityView from '../views/admin/reportes/ReportByModalityView.vue'
import ReportByInstructorView from '../views/admin/reportes/ReportByInstructorView.vue'

// Instructor views
import InstructorLogbooks from '../views/instructor/Logbooks.vue'
import InstructorHistory from '../views/instructor/History.vue'
import PersonalReport from '../views/instructor/PersonalReport.vue'
import MyApprentices from '../views/instructor/MyApprentices.vue'
import InstructorNews from '../views/instructor/News.vue'
import Followups from '../views/instructor/Followups.vue'
import HoursView from '../views/instructor/HoursView.vue'

// Apprentice views
import ApprenticeHome from '../views/aprendiz/ApprenticeHome.vue'
import Logbooks from '../views/aprendiz/Logbooks.vue'
import PersonalData from '../views/aprendiz/PersonalData.vue'
import MyRegistrations from '../views/aprendiz/MyRegistrations.vue'
import ProductiveStageProcess from '../views/aprendiz/ProductiveStageProcess.vue'
import ProductiveStageRegistration from '../views/aprendiz/ProductiveStageRegistration.vue'
import ChangePassword from '../views/aprendiz/ChangePassword.vue'
import EnterPasswordCode from '../views/aprendiz/EnterPasswordCode.vue'
import NewPassword from '../views/aprendiz/NewPassword.vue'

// Productive Stage Modalities
import ApprenticeshipContract from '../views/aprendiz/modalidadesEP/ApprenticeshipContract.vue'
import SenaMonitoring from '../views/aprendiz/modalidadesEP/SenaMonitoring.vue'
import NgoEntityInternship from '../views/aprendiz/modalidadesEP/NgoEntityInternship.vue'
import SmeInternship from '../views/aprendiz/modalidadesEP/SmeInternship.vue'
import FamilyBusinessInternship from '../views/aprendiz/modalidadesEP/FamilyBusinessInternship.vue'
import ProductiveProject from '../views/aprendiz/modalidadesEP/ProductiveProject.vue'
import EmploymentContract from '../views/aprendiz/modalidadesEP/EmploymentContract.vue'

const ADMIN_ROLES = ['ADMINISTRADOR', 'ETAPA PRODUCTIVA VIRTUAL', 'ETAPA PRODUCTIVA PRESENCIAL']
const INSTRUCTOR_ROLES = ['INSTRUCTOR', 'INSTRUCTOR OWNER']
const APPRENTICE_ROLES = ['APRENDIZ']

const routes = [
  { path: '/', name: 'Login', component: Login, meta: { requiresGuest: true } },
  { path: '/CambiarContrasena', name: 'ChangePassword', component: ChangePassword, meta: { requiresGuest: true } },
  { path: '/IngresarCodigoContrasena', name: 'EnterPasswordCode', component: EnterPasswordCode, meta: { requiresGuest: true } },
  { path: '/NuevaContrasena', name: 'NewPassword', component: NewPassword, meta: { requiresGuest: true } },
  {
    path: '/app',
    component: MainLayout,
    meta: { requiresAuth: true },
    redirect: { name: 'Home' },
    children: [
      { path: 'inicio', name: 'Home', component: Home },
      { path: 'aprendiz/inicio', name: 'ApprenticeHome', component: ApprenticeHome, meta: { roles: APPRENTICE_ROLES } },
      { path: 'aprendiz/registros', name: 'ApprenticeRegistrations', component: ProductiveStageRegistration, meta: { roles: APPRENTICE_ROLES } },
      { path: 'aprendiz/bitacoras', name: 'Logbooks', component: Logbooks, meta: { roles: APPRENTICE_ROLES } },
      { path: 'aprendiz/datospersonales', name: 'PersonalData', component: PersonalData, meta: { roles: APPRENTICE_ROLES } },
      { path: 'aprendiz/misregistros', name: 'MyRegistrations', component: MyRegistrations, meta: { roles: APPRENTICE_ROLES } },
      { path: 'aprendiz/procesoep', name: 'ProductiveStageProcess', component: ProductiveStageProcess, meta: { roles: APPRENTICE_ROLES } },
      { path: 'aprendiz/registroep', name: 'ProductiveStageRegistration', component: ProductiveStageRegistration, meta: { roles: APPRENTICE_ROLES } },
      { path: 'aprendiz/modalidadesEP/contratodeaprendizaje', name: 'ApprenticeshipContract', component: ApprenticeshipContract, meta: { roles: APPRENTICE_ROLES } },
      { path: 'aprendiz/modalidadesEP/monitoriasena', name: 'SenaMonitoring', component: SenaMonitoring, meta: { roles: APPRENTICE_ROLES } },
      { path: 'aprendiz/modalidadesEP/pasantiaongentidad', name: 'NgoEntityInternship', component: NgoEntityInternship, meta: { roles: APPRENTICE_ROLES } },
      { path: 'aprendiz/modalidadesEP/pasantiapyme', name: 'SmeInternship', component: SmeInternship, meta: { roles: APPRENTICE_ROLES } },
      { path: 'aprendiz/modalidadesEP/pasantiaupfamiliar', name: 'FamilyBusinessInternship', component: FamilyBusinessInternship, meta: { roles: APPRENTICE_ROLES } },
      { path: 'aprendiz/modalidadesEP/proyectoproductivo', name: 'ProductiveProject', component: ProductiveProject, meta: { roles: APPRENTICE_ROLES } },
      { path: 'aprendiz/modalidadesEP/vinculolaboralcontractual', name: 'EmploymentContract', component: EmploymentContract, meta: { roles: APPRENTICE_ROLES } },
      { path: 'admin/empresas', name: 'Companies', component: Companies, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/instructores', name: 'Instructors', component: Instructors, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/aprendices/:ficheId?', name: 'Apprentices', component: Apprentices, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/documentos', name: 'Documents', component: Documents, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/fichas', name: 'Groups', component: Groups, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/parametros', name: 'Parameters', component: Parameters, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/reportes', name: 'Reports', component: Reports, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/validarsolicitudes', name: 'ValidateRequests', component: ValidateRequests, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/novedadesAdmin', name: 'AdminNews', component: AdminNews, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/modalidadesEP', name: 'ProductiveStageModalities', component: ProductiveStageModalities, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/registrosEP', name: 'ProductiveStageRegistrations', component: ProductiveStageRegistrations, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/buscar-ficha', name: 'SearchGroup', component: SearchGroup, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/documentos/:ficha', name: 'DocumentsView', component: DocumentsView, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/documentos/:ficha/aprendiz/:aprendizId', name: 'ApprenticeDocumentsDetail', component: ApprenticeDocumentsDetail, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/alertas', name: 'Alerts', component: Alerts, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/almacenamiento', name: 'Storage', component: Storage, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/correos', name: 'Emails', component: Emails, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/horasintructores', name: 'InstructorHours', component: InstructorHours, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/procesoformativo', name: 'TrainingProcess', component: TrainingProcess, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/seguridad', name: 'Security', component: Security, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/plantillas', name: 'Templates', component: Templates, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/horasporinstructor', name: 'HoursByInstructor', component: HoursByInstructor, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/reporteporaño', name: 'ReportByYear', component: ReportByYear, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/reporteporempresa', name: 'ReportByCompany', component: ReportByCompany, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/reportepormodalidad', name: 'ReportByModality', component: ReportByModality, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/vistareporteporaño', name: 'ReportByYearView', component: ReportByYearView, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/vistareporteporempresa', name: 'ReportByCompanyView', component: ReportByCompanyView, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/vistareportepormodalidad', name: 'ReportByModalityView', component: ReportByModalityView, meta: { roles: ADMIN_ROLES } },
      { path: 'admin/vistareporteporinstructor', name: 'ReportByInstructorView', component: ReportByInstructorView, meta: { roles: ADMIN_ROLES } },
      { path: 'instructor/bitacoras', name: 'InstructorLogbooks', component: InstructorLogbooks, meta: { roles: INSTRUCTOR_ROLES } },
      { path: 'instructor/historial', name: 'InstructorHistory', component: InstructorHistory, meta: { roles: INSTRUCTOR_ROLES } },
      { path: 'instructor/informepersonal', name: 'PersonalReport', component: PersonalReport, meta: { roles: INSTRUCTOR_ROLES } },
      { path: 'instructor/misaprendices', name: 'MyApprentices', component: MyApprentices, meta: { roles: INSTRUCTOR_ROLES } },
      { path: 'instructor/novedades', name: 'InstructorNews', component: InstructorNews, meta: { roles: INSTRUCTOR_ROLES } },
      { path: 'instructor/seguimientos', name: 'Followups', component: Followups, meta: { roles: INSTRUCTOR_ROLES } },
      { path: 'instructor/vistahoras', name: 'HoursView', component: HoursView, meta: { roles: INSTRUCTOR_ROLES } }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth)
  const requiresGuest = to.matched.some((record) => record.meta?.requiresGuest)

  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ path: '/', query: { redirect: to.fullPath } })
  }

  if (requiresGuest && authStore.isAuthenticated) {
    return next(resolveDefaultRoute(authStore))
  }

  const requiredRoles = to.matched
    .filter((record) => Array.isArray(record.meta?.roles) && record.meta.roles.length > 0)
    .flatMap((record) => record.meta.roles)

  if (requiredRoles.length > 0 && !authStore.hasRole(requiredRoles)) {
    return next(resolveDefaultRoute(authStore))
  }

  return next()
})

function resolveDefaultRoute(authStore) {
  if (!authStore?.isAuthenticated) {
    return { path: '/' }
  }

  if (authStore.hasRole(APPRENTICE_ROLES)) {
    return { path: '/app/aprendiz/inicio' }
  }

  return { path: '/app/inicio' }
}

export default router
