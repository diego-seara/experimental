from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os, urllib.parse
root=Path(__file__).resolve().parent
routes={'/': 'pages/splash.html', '/splash': 'pages/splash.html', '/acceso': 'pages/acceso.html', '/inicio': 'pages/inicio.html', '/mi-dinero': 'pages/mi-dinero.html', '/productos': 'pages/productos.html', '/contratar': 'pages/contratar.html', '/operar': 'pages/operar.html', '/perfil': 'pages/perfil.html', '/ayuda': 'pages/ayuda.html', '/buzon': 'pages/buzon.html', '/buzon/mensaje': 'pages/buzon-mensaje.html', '/prevision': 'pages/prevision.html', '/notificaciones': 'pages/notificaciones.html', '/cuentas/online': 'pages/cuentas-online.html', '/cuentas/ahorro': 'pages/cuentas-ahorro.html', '/tarjetas/debito': 'pages/tarjetas-debito.html', '/contratar/cuenta': 'pages/contratar-cuenta.html', '/contratar/tarjeta': 'pages/contratar-tarjeta.html', '/contratar/ahorro': 'pages/contratar-ahorro.html', '/contratar/solicitud-recibida': 'pages/contratar-solicitud-recibida.html', '/conversacion/saldo': 'pages/conversacion-saldo.html', '/conversacion/pagos': 'pages/conversacion-pagos.html', '/conversacion/gasto': 'pages/conversacion-gasto.html', '/conversacion/tarjetas': 'pages/conversacion-tarjetas.html', '/conversacion/ayuda': 'pages/conversacion-ayuda.html', '/bizum/datos': 'pages/bizum-datos.html', '/bizum/revision': 'pages/bizum-revision.html', '/bizum/completado': 'pages/bizum-completado.html', '/transferencia/datos': 'pages/transferencia-datos.html', '/transferencia/revision': 'pages/transferencia-revision.html', '/transferencia/completada': 'pages/transferencia-completada.html', '/recibos/cubrir': 'pages/recibos-cubrir.html', '/recibos/completado': 'pages/recibos-completado.html', '/seguridad/revisar': 'pages/seguridad-revisar.html', '/seguridad/tarjeta-bloqueada': 'pages/seguridad-tarjeta-bloqueada.html', '/seguridad/pago-reconocido': 'pages/seguridad-pago-reconocido.html'}
routes['/research']='research.html'
class Handler(SimpleHTTPRequestHandler):
 def translate_path(self,path):
  p=urllib.parse.urlsplit(path).path.rstrip('/') or '/'
  if p in routes:return str(root / routes[p])
  return str(root / p.lstrip('/'))
if __name__=='__main__':
 os.chdir(root)
 print('Abrir http://localhost:8787/research')
 ThreadingHTTPServer(('127.0.0.1',8787),Handler).serve_forever()
