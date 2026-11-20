const coreExamples = [
    {
        "id": "apex-clase",
        "stack": "Salesforce",
        "title": "Clase, constructor y método",
        "file": "CuentaServicio.cls",
        "tip": "Guarda la clase con el mismo nombre del archivo. El constructor recibe una etiqueta y el método usa el valor de la instancia.",
        "code": "public with sharing class CuentaServicio {\n    private final String etiqueta;\n\n    public CuentaServicio(String etiqueta) {\n        this.etiqueta = etiqueta;\n    }\n\n    public String resumen() {\n        return 'Cuenta: ' + etiqueta;\n    }\n}",
        "symbol": "CuentaServicio"
    },
    {
        "id": "apex-rest",
        "stack": "Salesforce",
        "title": "Consumir REST desde Apex",
        "file": "CatalogoApi.cls",
        "tip": "Configura la Named Credential Catalogo. Prueba los códigos 200, 401 y 500 con HttpCalloutMock.",
        "code": "public with sharing class CatalogoApi {\n    public class IntegrationException extends Exception {}\n\n    public static String listar() {\n        HttpRequest req = new HttpRequest();\n        req.setEndpoint('callout:Catalogo/items');\n        req.setMethod('GET');\n        req.setTimeout(10000);\n        req.setHeader('Accept', 'application/json');\n        HttpResponse res = new Http().send(req);\n        if (res.getStatusCode() < 200 || res.getStatusCode() >= 300) {\n            throw new IntegrationException('HTTP ' + res.getStatusCode());\n        }\n        return res.getBody();\n    }\n}",
        "symbol": "CatalogoApi"
    },
    {
        "id": "apex-soap",
        "stack": "Salesforce",
        "title": "Consumir SOAP 1.1 desde Apex",
        "file": "CatalogoSoap.cls",
        "tip": "Proporciona un sobre XML compatible con el WSDL. Ajusta SOAPAction y comprueba SOAP Fault antes de extraer la respuesta de negocio.",
        "code": "public with sharing class CatalogoSoap {\n    public static HttpResponse enviar(String envelope) {\n        HttpRequest req = new HttpRequest();\n        req.setEndpoint('callout:CatalogoSoap');\n        req.setMethod('POST');\n        req.setTimeout(10000);\n        req.setHeader('Content-Type', 'text/xml; charset=utf-8');\n        req.setHeader('SOAPAction', '\"urn:ejemplo:Consultar\"');\n        req.setBody(envelope);\n        return new Http().send(req);\n    }\n}",
        "symbol": "CatalogoSoap"
    },
    {
        "id": "lwc-form",
        "stack": "Salesforce",
        "title": "Formulario LWC para alta de cuentas",
        "file": "cuentaForm.html",
        "tip": "Es el HTML de un componente Lightning. Lightning Data Service guarda el registro y lightning-messages muestra errores.",
        "code": "<template>\n    <lightning-record-edit-form object-api-name=\"Account\">\n        <lightning-messages></lightning-messages>\n        <lightning-input-field field-name=\"Name\" required></lightning-input-field>\n        <lightning-button type=\"submit\" label=\"Guardar\" variant=\"brand\"></lightning-button>\n    </lightning-record-edit-form>\n</template>"
    },
    {
        "id": "kotlin-clase",
        "stack": "Android",
        "title": "Clase, constructor y método en Kotlin",
        "file": "CuentaServicio.kt",
        "tip": "El constructor primario recibe la etiqueta y la conserva como propiedad privada.",
        "code": "class CuentaServicio(private val etiqueta: String) {\n    fun resumen(): String = \"Cuenta: $etiqueta\"\n}",
        "symbol": "CuentaServicio"
    },
    {
        "id": "compose-form",
        "stack": "Android",
        "title": "Formulario con Jetpack Compose",
        "file": "CuentaForm.kt",
        "tip": "Invoca el composable desde una pantalla. El callback recibe un nombre sin espacios sobrantes. Valida también en el servidor si se guarda de forma remota.",
        "code": "import androidx.compose.foundation.layout.Column\nimport androidx.compose.material3.Button\nimport androidx.compose.material3.OutlinedTextField\nimport androidx.compose.material3.Text\nimport androidx.compose.runtime.*\nimport androidx.compose.runtime.saveable.rememberSaveable\n\n@Composable\nfun CuentaForm(onSave: (String) -> Unit) {\n    var name by rememberSaveable { mutableStateOf(\"\") }\n    Column {\n        OutlinedTextField(\n            value = name,\n            onValueChange = { name = it },\n            label = { Text(\"Nombre\") },\n            singleLine = true\n        )\n        Button(onClick = { onSave(name.trim()) }, enabled = name.isNotBlank()) {\n            Text(\"Guardar\")\n        }\n    }\n}",
        "symbol": "CuentaForm"
    },
    {
        "id": "android-api",
        "stack": "Android",
        "title": "Consumir REST y SOAP con OkHttp",
        "file": "ServicioApi.kt",
        "tip": "Agrega OkHttp y kotlinx-coroutines y declara INTERNET en el manifiesto. Llama desde un ViewModel. En SOAP, verifica Fault y usa los namespaces del WSDL.",
        "code": "import kotlinx.coroutines.Dispatchers\nimport kotlinx.coroutines.withContext\nimport okhttp3.MediaType.Companion.toMediaType\nimport okhttp3.OkHttpClient\nimport okhttp3.Request\nimport okhttp3.RequestBody.Companion.toRequestBody\n\nclass ServicioApi(private val client: OkHttpClient) {\n    suspend fun listar(): String = send(\n        Request.Builder().url(\"https://example.com/items\")\n            .header(\"Accept\", \"application/json\").build()\n    )\n\n    suspend fun consultar(envelope: String): String = send(\n        Request.Builder().url(\"https://example.com/soap\")\n            .header(\"SOAPAction\", \"\\\"urn:ejemplo:Consultar\\\"\")\n            .post(envelope.toRequestBody(\"text/xml; charset=utf-8\".toMediaType())).build()\n    )\n\n    private suspend fun send(request: Request): String = withContext(Dispatchers.IO) {\n        client.newCall(request).execute().use { response ->\n            check(response.isSuccessful) { \"HTTP ${response.code}\" }\n            response.body?.string().orEmpty()\n        }\n    }\n}",
        "symbol": "ServicioApi"
    },
    {
        "id": "web-rest",
        "stack": "Web",
        "title": "Consumir REST con fetch",
        "file": "listar.ts",
        "tip": "Usa un endpoint de tu aplicación. Maneja errores de red y verifica la forma de la respuesta antes de usarla.",
        "code": "export async function listar(signal?: AbortSignal): Promise<unknown> {\n    const response = await fetch('/api/items', {\n        headers: { Accept: 'application/json' },\n        signal,\n    });\n    if (!response.ok) throw new Error('HTTP ' + response.status);\n    return response.json();\n}"
    },
    {
        "id": "web-soap",
        "stack": "Web",
        "title": "Consumir SOAP desde el servidor",
        "file": "consultar.ts",
        "tip": "Ejecuta el fragmento en el servidor. Comprueba Fault en el XML según el WSDL. Mantén credenciales y configuración fuera del cliente.",
        "code": "export async function consultar(envelope: string): Promise<string> {\n    const response = await fetch('https://example.com/soap', {\n        method: 'POST',\n        headers: {\n            'Content-Type': 'text/xml; charset=utf-8',\n            SOAPAction: '\"urn:ejemplo:Consultar\"',\n        },\n        body: envelope,\n        signal: AbortSignal.timeout(10000),\n    });\n    const xml = await response.text();\n    if (!response.ok) throw new Error('HTTP ' + response.status);\n    return xml;\n}"
    },
    {
        "id": "react-form",
        "stack": "Web",
        "title": "Formulario React con validación",
        "file": "CuentaForm.tsx",
        "tip": "Usa el callback para enviar el dato. Si lo persistes, valida del lado servidor y muestra errores sin borrar lo escrito.",
        "code": "\"use client\";\n\nimport { useState } from 'react';\n\nexport default function CuentaForm({ onSave }: { onSave: (name: string) => void }) {\n    const [name, setName] = useState('');\n    return (\n        <form onSubmit={event => {\n            event.preventDefault();\n            const value = name.trim();\n            if (value) onSave(value);\n        }}>\n            <label>Nombre\n                <input required value={name} onChange={event => setName(event.target.value)} />\n            </label>\n            <button type=\"submit\" disabled={!name.trim()}>Guardar</button>\n        </form>\n    );\n}",
        "symbol": "CuentaForm"
    },
    {
        "id": "ts-clase",
        "stack": "Web",
        "title": "Clase, constructor y método en TypeScript",
        "file": "CuentaServicio.ts",
        "tip": "La propiedad del constructor queda disponible para los métodos de instancia.",
        "code": "export class CuentaServicio {\n    constructor(private readonly etiqueta: string) {}\n\n    resumen(): string {\n        return 'Cuenta: ' + this.etiqueta;\n    }\n}",
        "symbol": "CuentaServicio"
    },
    {
        "id": "java-clase",
        "stack": "Java",
        "title": "Clase, constructor y método",
        "file": "CuentaServicio.java",
        "tip": "Guarda el archivo con el nombre de la clase pública.",
        "code": "public final class CuentaServicio {\n    private final String etiqueta;\n\n    public CuentaServicio(String etiqueta) {\n        this.etiqueta = etiqueta;\n    }\n\n    public String resumen() {\n        return \"Cuenta: \" + etiqueta;\n    }\n}",
        "symbol": "CuentaServicio"
    },
    {
        "id": "swift-clase",
        "stack": "iOS",
        "title": "Clase, inicializador y método en Swift",
        "file": "CuentaServicio.swift",
        "tip": "Swift usa init para inicializar propiedades antes de utilizar la instancia.",
        "code": "final class CuentaServicio {\n    private let etiqueta: String\n\n    init(etiqueta: String) {\n        self.etiqueta = etiqueta\n    }\n\n    func resumen() -> String {\n        \"Cuenta: \" + etiqueta\n    }\n}",
        "symbol": "CuentaServicio"
    },
    {
        "id": "python-clase",
        "stack": "Python y Django",
        "title": "Clase, inicializador y método",
        "file": "cuenta_servicio.py",
        "tip": "Mantén la lógica de negocio en una clase independiente cuando necesites probarla sin la vista Django.",
        "code": "class CuentaServicio:\n    def __init__(self, etiqueta: str) -> None:\n        self.etiqueta = etiqueta\n\n    def resumen(self) -> str:\n        return f\"Cuenta: {self.etiqueta}\"",
        "symbol": "CuentaServicio"
    },
    {
        "id": "ruby-clase",
        "stack": "Ruby y Rails",
        "title": "Clase, inicializador y método",
        "file": "cuenta_servicio.rb",
        "tip": "En Rails, mantén la convención entre el nombre del archivo y el de la clase.",
        "code": "class CuentaServicio\n  def initialize(etiqueta)\n    @etiqueta = etiqueta\n  end\n\n  def resumen\n    \"Cuenta: #{@etiqueta}\"\n  end\nend",
        "symbol": "CuentaServicio"
    }
];

const recipes = [
    {
        "id": "apex-wrapper",
        "stack": "Salesforce",
        "title": "Wrapper Apex para JSON y constructor",
        "file": "SolicitudDto.cls",
        "tip": "Usa un DTO para separar el contrato de integración del modelo de tu org. Este ejemplo serializa una solicitud. En la entrada, valida los campos después de deserializar.",
        "symbol": "SolicitudDto",
        "code": "public class SolicitudDto {\n    public String id;\n    public String estado;\n\n    public SolicitudDto(String id, String estado) {\n        this.id = id;\n        this.estado = estado;\n    }\n\n    public String toJson() {\n        return JSON.serialize(this);\n    }\n}\n\n// En Apex anónimo:\n// System.debug(new SolicitudDto('REF-100', 'Abierta').toJson());"
    },
    {
        "id": "apex-flow",
        "stack": "Salesforce",
        "title": "Acción invocable de Apex para Flow",
        "file": "NormalizarSolicitudes.cls",
        "tip": "Agrega la acción a Flow Builder y da acceso a la clase con un permiso. Prueba entradas nulas, una entrada y varias. Devuelve una salida por entrada y conserva el orden.",
        "symbol": "NormalizarSolicitudes",
        "code": "public with sharing class NormalizarSolicitudes {\n    public class Entrada {\n        @InvocableVariable(required=true)\n        public String referencia;\n    }\n\n    public class Salida {\n        @InvocableVariable\n        public String referencia;\n        @InvocableVariable\n        public Boolean valida;\n    }\n\n    @InvocableMethod(label='Normalizar referencias de solicitudes')\n    public static List<Salida> normalizar(List<Entrada> entradas) {\n        List<Salida> resultados = new List<Salida>();\n        for (Entrada fila : entradas) {\n            Salida resultado = new Salida();\n            resultado.valida = fila != null && String.isNotBlank(fila.referencia);\n            resultado.referencia = resultado.valida ? fila.referencia.trim().toUpperCase() : null;\n            resultados.add(resultado);\n        }\n        return resultados;\n    }\n}"
    },
    {
        "id": "apex-job",
        "stack": "Salesforce",
        "title": "Job Queueable con callout",
        "file": "ConsultarCatalogoJob.cls",
        "tip": "Configura la Named Credential Catalogo. Ejecuta System.enqueueJob(new ConsultarCatalogoJob()) desde Apex. Consulta el ID del job en Apex Jobs y usa HttpCalloutMock con Test.startTest y Test.stopTest para probarlo.",
        "symbol": "ConsultarCatalogoJob",
        "code": "public with sharing class ConsultarCatalogoJob implements Queueable, Database.AllowsCallouts {\n    public class ErrorRemoto extends Exception {}\n\n    public void execute(QueueableContext context) {\n        HttpRequest req = new HttpRequest();\n        req.setEndpoint('callout:Catalogo/items');\n        req.setMethod('GET');\n        req.setTimeout(10000);\n        HttpResponse res = new Http().send(req);\n        if (res.getStatusCode() / 100 != 2) {\n            throw new ErrorRemoto('HTTP ' + res.getStatusCode());\n        }\n        List<Object> items = (List<Object>) JSON.deserializeUntyped(res.getBody());\n        System.debug(LoggingLevel.INFO, 'Elementos recibidos: ' + items.size());\n    }\n}"
    },
    {
        "id": "android-worker",
        "stack": "Android",
        "title": "Job persistente con WorkManager",
        "file": "PrepararCacheWorker.kt",
        "tip": "Agrega androidx.work:work-runtime-ktx a tu proyecto. El trabajo prepara un directorio de caché en segundo plano. El nombre único evita encolar dos trabajos equivalentes mientras uno está pendiente.",
        "symbol": "PrepararCacheWorker",
        "code": "import android.content.Context\nimport androidx.work.CoroutineWorker\nimport androidx.work.ExistingWorkPolicy\nimport androidx.work.OneTimeWorkRequestBuilder\nimport androidx.work.WorkManager\nimport androidx.work.WorkerParameters\nimport kotlinx.coroutines.Dispatchers\nimport kotlinx.coroutines.withContext\nimport java.io.File\n\nclass PrepararCacheWorker(context: Context, params: WorkerParameters) :\n    CoroutineWorker(context, params) {\n    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {\n        val folder = File(applicationContext.cacheDir, \"catalogo\")\n        if (folder.isDirectory || folder.mkdirs() || folder.isDirectory) {\n            Result.success()\n        } else {\n            Result.failure()\n        }\n    }\n}\n\nfun prepararCache(context: Context) {\n    WorkManager.getInstance(context).enqueueUniqueWork(\n        \"preparar-cache-catalogo\",\n        ExistingWorkPolicy.KEEP,\n        OneTimeWorkRequestBuilder<PrepararCacheWorker>().build()\n    )\n}"
    },
    {
        "id": "web-retry",
        "stack": "Web",
        "title": "Leer Retry-After en un GET",
        "file": "catalogo.ts",
        "tip": "Este ejemplo muestra cómo comunicar el límite al usuario para decidir cuándo reintentar. Para un POST, revisa si repetir la operación podría duplicar efectos.",
        "code": "export async function cargarCatalogo(signal?: AbortSignal) {\n    const response = await fetch('/api/items', { signal });\n    if (response.status === 429 || response.status === 503) {\n        const retryAfter = response.headers.get('Retry-After');\n        return { ok: false as const, status: response.status, retryAfter };\n    }\n    if (!response.ok) throw new Error('HTTP ' + response.status);\n    return { ok: true as const, data: await response.json() as unknown };\n}"
    }
];

export const examples = [...coreExamples, ...recipes, ...[
    {
        "id": "java-http",
        "stack": "Java",
        "title": "Consumo REST y SOAP con HttpClient",
        "file": "CatalogoCliente.java",
        "tip": "Ejemplo para Java 11 o superior. Usa el SOAPAction y sobre que indique el WSDL.",
        "code": "import java.io.IOException;\nimport java.net.URI;\nimport java.net.http.*;\nimport java.time.Duration;\n\npublic final class CatalogoCliente {\n    private final HttpClient client = HttpClient.newHttpClient();\n\n    public String listar() throws IOException, InterruptedException {\n        return enviar(HttpRequest.newBuilder(URI.create(\"https://example.com/items\"))\n            .timeout(Duration.ofSeconds(10)).header(\"Accept\", \"application/json\").GET().build());\n    }\n\n    public String consultar(String xml) throws IOException, InterruptedException {\n        return enviar(HttpRequest.newBuilder(URI.create(\"https://example.com/soap\"))\n            .timeout(Duration.ofSeconds(10))\n            .header(\"Content-Type\", \"text/xml; charset=utf-8\")\n            .header(\"SOAPAction\", \"\\\"urn:ejemplo:Consultar\\\"\")\n            .POST(HttpRequest.BodyPublishers.ofString(xml)).build());\n    }\n\n    private String enviar(HttpRequest request) throws IOException, InterruptedException {\n        var response = client.send(request, HttpResponse.BodyHandlers.ofString());\n        if (response.statusCode() / 100 != 2) throw new IOException(\"HTTP \" + response.statusCode());\n        return response.body();\n    }\n}"
    },
    {
        "id": "spring-form",
        "stack": "Java",
        "title": "Recibir un formulario en Spring MVC",
        "file": "CuentaController.java",
        "tip": "Usa Spring Web. Envía un campo name a POST /cuentas desde una vista con protección CSRF configurada. La respuesta demuestra validación sin persistir datos.",
        "code": "import org.springframework.http.ResponseEntity;\nimport org.springframework.web.bind.annotation.*;\n\n@RestController\npublic class CuentaController {\n    @PostMapping(\"/cuentas\")\n    public ResponseEntity<String> crear(@RequestParam(\"name\") String name) {\n        String value = name.strip();\n        if (value.isEmpty() || value.length() > 80) {\n            return ResponseEntity.badRequest().body(\"Escribe un nombre de hasta 80 caracteres.\");\n        }\n        return ResponseEntity.ok(\"Nombre válido\");\n    }\n}"
    },
    {
        "id": "swift-form",
        "stack": "iOS",
        "title": "Formulario SwiftUI",
        "file": "CuentaForm.swift",
        "tip": "Usa el callback para actualizar tu modelo. El botón solo se habilita con un nombre que tenga contenido.",
        "code": "import SwiftUI\n\nstruct CuentaForm: View {\n    @State private var name = \"\"\n    let onSave: (String) -> Void\n\n    var body: some View {\n        let clean = name.trimmingCharacters(in: .whitespacesAndNewlines)\n        Form {\n            TextField(\"Nombre\", text: $name)\n            Button(\"Guardar\") { onSave(clean) }\n                .disabled(clean.isEmpty)\n        }\n    }\n}"
    },
    {
        "id": "swift-http",
        "stack": "iOS",
        "title": "Consumo REST y SOAP con URLSession",
        "file": "CatalogoCliente.swift",
        "tip": "Prueba la respuesta HTTP antes de decodificar JSON o XML. Para SOAP, construye el sobre según el WSDL.",
        "code": "import Foundation\n\nstruct CatalogoCliente {\n    func listar() async throws -> Data {\n        var request = URLRequest(url: URL(string: \"https://example.com/items\")!)\n        request.setValue(\"application/json\", forHTTPHeaderField: \"Accept\")\n        return try await enviar(request)\n    }\n\n    func consultar(envelope: String) async throws -> Data {\n        var request = URLRequest(url: URL(string: \"https://example.com/soap\")!)\n        request.httpMethod = \"POST\"\n        request.httpBody = Data(envelope.utf8)\n        request.setValue(\"text/xml; charset=utf-8\", forHTTPHeaderField: \"Content-Type\")\n        request.setValue(\"\\\"urn:ejemplo:Consultar\\\"\", forHTTPHeaderField: \"SOAPAction\")\n        return try await enviar(request)\n    }\n\n    private func enviar(_ request: URLRequest) async throws -> Data {\n        let (data, response) = try await URLSession.shared.data(for: request)\n        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {\n            throw URLError(.badServerResponse)\n        }\n        return data\n    }\n}"
    },
    {
        "id": "django-form",
        "stack": "Python y Django",
        "title": "Validar un formulario en Django",
        "file": "forms.py",
        "tip": "En la vista usa el formulario ligado a request.POST y llama is_valid(). Incluye csrf_token en la plantilla HTML.",
        "code": "from django import forms\n\nclass CuentaForm(forms.Form):\n    name = forms.CharField(label=\"Nombre\", max_length=80, strip=True)"
    },
    {
        "id": "python-http",
        "stack": "Python y Django",
        "title": "Consumo REST y SOAP con requests",
        "file": "catalogo.py",
        "tip": "Instala requests en tu entorno. Haz estas llamadas fuera del ciclo de render de la plantilla y verifica SOAP Fault con el contrato del servicio.",
        "code": "import requests\n\ndef listar():\n    response = requests.get(\"https://example.com/items\", timeout=10)\n    response.raise_for_status()\n    return response.json()\n\ndef consultar(envelope: str):\n    response = requests.post(\n        \"https://example.com/soap\",\n        data=envelope.encode(\"utf-8\"),\n        headers={\"Content-Type\": \"text/xml; charset=utf-8\",\n                 \"SOAPAction\": '\"urn:ejemplo:Consultar\"'},\n        timeout=10,\n    )\n    response.raise_for_status()\n    return response.text"
    },
    {
        "id": "rails-form",
        "stack": "Ruby y Rails",
        "title": "Formulario Rails",
        "file": "new.html.erb",
        "tip": "Define la ruta POST de cuentas y valida en el controlador o modelo. El campo HTML ofrece una primera validación.",
        "code": "<%= form_with url: \"/cuentas\", method: :post do |form| %>\n  <%= form.label :name, \"Nombre\" %>\n  <%= form.text_field :name, required: true, maxlength: 80 %>\n  <%= form.submit \"Guardar\" %>\n<% end %>"
    },
    {
        "id": "ruby-http",
        "stack": "Ruby y Rails",
        "title": "Consumo REST y SOAP con Net::HTTP",
        "file": "catalogo.rb",
        "tip": "Usa HTTPS. Para producción revisa SOAP Fault incluso si el HTTP es exitoso.",
        "code": "require \"net/http\"\nrequire \"json\"\n\ndef enviar(request, uri)\n  response = Net::HTTP.start(uri.host, uri.port, use_ssl: true,\n                             open_timeout: 5, read_timeout: 10) { |http| http.request(request) }\n  raise \"HTTP #{response.code}\" unless response.is_a?(Net::HTTPSuccess)\n  response.body\nend\n\ndef listar\n  uri = URI(\"https://example.com/items\")\n  JSON.parse(enviar(Net::HTTP::Get.new(uri), uri))\nend\n\ndef consultar(envelope)\n  uri = URI(\"https://example.com/soap\")\n  request = Net::HTTP::Post.new(uri)\n  request[\"Content-Type\"] = \"text/xml; charset=utf-8\"\n  request[\"SOAPAction\"] = '\"urn:ejemplo:Consultar\"'\n  request.body = envelope\n  enviar(request, uri)\nend"
    }
]];
