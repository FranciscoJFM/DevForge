export function clientCode(format: string, method: string, path: string, body: string, soap: boolean, origin = 'https://example.invalid') {
    const headers = soap ? { 'Content-Type': 'text/xml; charset=utf-8', SOAPAction: '"urn:devforge:Add"' }
        : { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) };
    const url = origin + path;
    if (format === 'curl') {
        const quote = (value: string) => "'" + value.replaceAll("'", "'\"'\"'") + "'";
        return ['curl --include --request ' + method, ...Object.entries(headers).map(([key, value]) => '--header ' + quote(key + ': ' + value)),
            ...(body ? ['--data-raw ' + quote(body)] : []), quote(url)].join(' ');
    }
    if (format === 'apex') {
        const quote = (value: string) => "'" + value.replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('\r', '\\r').replaceAll('\n', '\\n').replaceAll('\t', '\\t') + "'";
        return 'HttpRequest req = new HttpRequest();\nreq.setEndpoint(' + quote('callout:DevForgeDemo' + path) + ');\nreq.setMethod(' + quote(method) + ');\nreq.setTimeout(10000);\n'
            + Object.entries(headers).map(([key, value]) => 'req.setHeader(' + quote(key) + ', ' + quote(value) + ');').join('\n')
            + (body ? '\nreq.setBody(' + quote(body) + ');' : '') + '\nHttpResponse res = new Http().send(req);\nInteger status = res.getStatusCode();\nString payload = res.getBody();';
    }
    if (['kotlin', 'java', 'swift', 'python', 'ruby'].includes(format)) {
        const literal = JSON.stringify;
        const bytes = btoa(String.fromCharCode(...new TextEncoder().encode(body)));
        const entries = Object.entries(headers);
        if (format === 'kotlin') {
            const kotlinString = (value: string) => literal(value).replaceAll('$', '\\$');
            const contentType = headers['Content-Type'] ?? 'application/octet-stream';
            return 'import android.util.Base64\nimport okhttp3.*\nimport okhttp3.MediaType.Companion.toMediaType\nimport okhttp3.RequestBody.Companion.toRequestBody\n\n'
                + '// Ejecuta en Dispatchers.IO y reutiliza client en tu app.\n'
                + 'val client = OkHttpClient()\nval request = Request.Builder().url(' + kotlinString(url) + ')\n'
                + entries.map(([key, value]) => '    .header(' + literal(key) + ', ' + literal(value) + ')\n').join('')
                + '    .method(' + literal(method) + ', ' + (body ? 'Base64.decode(' + literal(bytes) + ', Base64.DEFAULT).toRequestBody(' + literal(contentType) + '.toMediaType())' : ['POST', 'PUT', 'PATCH'].includes(method) ? 'ByteArray(0).toRequestBody()' : 'null') + ').build()\n'
                + 'client.newCall(request).execute().use { response ->\n    check(response.isSuccessful) { "HTTP ${response.code}" }\n    val payload = response.body?.string()\n}';
        }
        if (format === 'java') {
            return 'import java.net.URI;\nimport java.net.http.*;\nimport java.time.Duration;\nimport java.util.Base64;\n\n'
                + '// En un método que maneje IOException e InterruptedException.\n'
                + 'var request = HttpRequest.newBuilder(URI.create(' + literal(url) + '))\n    .timeout(Duration.ofSeconds(10))\n'
                + entries.map(([key, value]) => '    .header(' + literal(key) + ', ' + literal(value) + ')\n').join('')
                + '    .method(' + literal(method) + ', ' + (body ? 'HttpRequest.BodyPublishers.ofByteArray(Base64.getDecoder().decode(' + literal(bytes) + '))' : 'HttpRequest.BodyPublishers.noBody()') + ').build();\n'
                + 'var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());\nif (response.statusCode() / 100 != 2) throw new IllegalStateException("HTTP " + response.statusCode());\nvar payload = response.body();';
        }
        if (format === 'swift') {
            return 'import Foundation\n\n// Dentro de un método async throws.\n'
                + 'var request = URLRequest(url: URL(string: ' + literal(url) + ')!)\nrequest.httpMethod = ' + literal(method) + '\nrequest.timeoutInterval = 10\n'
                + entries.map(([key, value]) => 'request.setValue(' + literal(value) + ', forHTTPHeaderField: ' + literal(key) + ')\n').join('')
                + (body ? 'request.httpBody = Data(base64Encoded: ' + literal(bytes) + ')\n' : '')
                + 'let (payload, response) = try await URLSession.shared.data(for: request)\nguard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {\n    throw URLError(.badServerResponse)\n}';
        }
        if (format === 'python') {
            return 'from base64 import b64decode\nimport requests\n\nresponse = requests.request(\n    ' + literal(method) + ', ' + literal(url)
                + ',\n    headers=' + JSON.stringify(headers)
                + (body ? ',\n    data=b64decode(' + literal(bytes) + ')' : '')
                + ',\n    timeout=10,\n)\nresponse.raise_for_status()\npayload = response.content';
        }
        return 'require "net/http"\nrequire "base64"\n\nuri = URI(' + literal(url) + ')\n'
            + 'http = Net::HTTP.new(uri.host, uri.port)\nhttp.use_ssl = true\nhttp.open_timeout = 5\nhttp.read_timeout = 10\n'
            + 'request = Net::HTTPGenericRequest.new(' + literal(method) + ', ' + Boolean(body) + ', true, uri.request_uri)\n'
            + entries.map(([key, value]) => 'request[' + literal(key) + '] = ' + literal(value) + '\n').join('')
            + (body ? 'request.body = Base64.strict_decode64(' + literal(bytes) + ')\n' : '')
            + 'response = http.request(request)\nraise "HTTP #{response.code}" unless response.is_a?(Net::HTTPSuccess)\npayload = response.body';
    }
    return 'const response = await fetch(' + JSON.stringify(url) + ', ' + JSON.stringify({ method, headers, ...(body ? { body } : {}), signal: 'TIMEOUT_PLACEHOLDER' }, null, 2).replace('"signal": "TIMEOUT_PLACEHOLDER"','"signal": AbortSignal.timeout(10_000)') + ');\nconst payload = response.status === 204 ? null : await response.text();\nif (!response.ok) throw new Error("HTTP " + response.status);';
}
