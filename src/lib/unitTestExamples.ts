import type { ToolStack } from './toolStacks';

export const unitTestExamples: Record<ToolStack, { language: string; code: string }> = {
    apex: { language: 'apex', code: "@IsTest\nprivate class CuentaServicioTest {\n    @IsTest\n    static void usaLaEtiquetaDelConstructor() {\n        CuentaServicio servicio = new CuentaServicio('Demo');\n        System.assertEquals('Cuenta: Demo', servicio.resumen());\n    }\n}" },
    kotlin: { language: 'kotlin', code: 'import org.junit.Assert.assertEquals\nimport org.junit.Test\n\nclass CuentaServicioTest {\n    @Test fun usaLaEtiqueta() {\n        assertEquals("Cuenta: Demo", CuentaServicio("Demo").resumen())\n    }\n}' },
    fetch: { language: 'typescript', code: "import { strict as assert } from 'node:assert';\nimport { test } from 'node:test';\nimport { CuentaServicio } from './CuentaServicio.ts';\n\ntest('usa la etiqueta del constructor', () => {\n    assert.equal(new CuentaServicio('Demo').resumen(), 'Cuenta: Demo');\n});" },
    java: { language: 'java', code: 'import static org.junit.jupiter.api.Assertions.assertEquals;\nimport org.junit.jupiter.api.Test;\n\nclass CuentaServicioTest {\n    @Test void usaLaEtiqueta() {\n        assertEquals("Cuenta: Demo", new CuentaServicio("Demo").resumen());\n    }\n}' },
    swift: { language: 'swift', code: 'import XCTest\n@testable import TuModulo\n\nfinal class CuentaServicioTest: XCTestCase {\n    func testUsaLaEtiqueta() {\n        XCTAssertEqual(CuentaServicio(etiqueta: "Demo").resumen(), "Cuenta: Demo")\n    }\n}' },
    python: { language: 'python', code: 'import unittest\nfrom cuenta_servicio import CuentaServicio\n\nclass CuentaServicioTest(unittest.TestCase):\n    def test_usa_la_etiqueta(self):\n        self.assertEqual(CuentaServicio("Demo").resumen(), "Cuenta: Demo")' },
    ruby: { language: 'ruby', code: 'require "minitest/autorun"\nrequire_relative "cuenta_servicio"\n\nclass CuentaServicioTest < Minitest::Test\n  def test_usa_la_etiqueta\n    assert_equal "Cuenta: Demo", CuentaServicio.new("Demo").resumen\n  end\nend' },
};
