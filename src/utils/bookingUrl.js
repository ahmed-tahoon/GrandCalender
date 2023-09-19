export default function bookingUrl(username, slug = null) {
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
    if (slug && subdomain) {
        return `${protocol}://${subdomain}.${domain}/${username}/${slug}`
    }
    if (slug) {
        return `${protocol}://${domain}/${username}/${slug}`
    }
    if (subdomain) {
        return `${protocol}://${subdomain}.${domain}/${username}`
    }
    return `${protocol}://${domain}/${username}`
}
