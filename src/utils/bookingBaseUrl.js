export default function bookingBaseUrl() {
    // Need to return url in prod: https://booking-stage.grandcalender.io/:username
    // subdomain is VITE_BOOKING_SUBDOMAIN
    // http and https if NODE_ENV is development or production
    // username coming from username param
    // Domain is VITE_APP_DOMAIN
    // return `https://booking-stage.grandcalender.io/${username}`
    // if has slug return `https://booking-stage.grandcalender.io/${username}/${slug}`
    const subdomain = import.meta.env.VITE_BOOKING_SUBDOMAIN ?? ''
    const domain = import.meta.env.VITE_APP_DOMAIN
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    // check slug and subdomain
    if (subdomain) {
        return `${protocol}://${subdomain}.${domain}`
    }
    if (subdomain) {
        return `${protocol}://${subdomain}.${domain}`
    }
    return `${protocol}://${domain}`
}
