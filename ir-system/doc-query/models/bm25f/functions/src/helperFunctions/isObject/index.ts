export default function isObject(element: any) {
    return (!!element) && (element.constructor === Object);
}