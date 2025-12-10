export async function asyncForEach<T>(
    array: T[],
    callback: (item: T) => Promise<void>
): Promise<void> {
    for (const item of array) {
        await callback(item);
    }
}
