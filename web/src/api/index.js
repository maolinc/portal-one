import { api } from './client.js'

export const getSiteConfig = () => api('/site/config')
export const getHome = () => api('/home')
export const getBusinessList = () => api('/business')
export const getBusiness = (slug) => api(`/business/${slug}`)
export const getServicesList = () => api('/services')
export const getService = (slug) => api(`/services/${slug}`)
export const getCases = () => api('/cases')
export const getCase = (slug) => api(`/cases/${slug}`)
export const getAbout = (section) => api(`/about/${section}`)
export const getPageSeo = (page) => api(`/seo/${page}`)
export const submitMessage = (payload) =>
  api('/contact/messages', { method: 'POST', body: payload })
