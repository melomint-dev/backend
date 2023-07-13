export async function* readStream(reader) {
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            return;
        }
        yield value;
    }
}

export async function stream2buffer(stream) {
    const reader = stream.getReader();
    const chunks = [];

    for await (const value of readStream(reader)) {
        chunks.push(value);
    }

    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const buffer = Buffer.concat(chunks, totalLength);
    return buffer;
}