export default function(path: string, obj: object = self, separator: string = '.') {
    const properties = Array.isArray(path) ? path : path.split(separator);
    return (properties as any).reduce((prev: any, curr: any) => prev && prev[curr], obj)
}