Este conjunto de componentes intenta resolver el problema presentado
en el seminario 5 de SAD.

Se ha implementado un descubrimiento dinámico, con un heartbeat de 5 segundos donde el componente pub anuncia su nombre (en este caso el puerto para el socket rep) que permite a los componentes sub hacer peticiones req a los pub.

El próposito del programa es que los suscriptores puedan acceder a contenido que los publicadores tienen. Los suscriptores eligen un elemento al azar y hacen una petición al publicador para que les envíe el contenido de esa clave de datos. El programa puede mejorarse dotando al sistema de una distribución de datos replicados entre múltiples publicadores.

## Ejecutar un ejemplo
En una pestaña de la shell lanza el broker:
```
node proxy.js
```

En otra pestaña de la shell lanza tantos suscriptores como desees:
```
node sub.js
```

En otra pestaña de la shell lanza uno o más publicadores:
```
node pub.js 6000 '{"0":"abc","1":"def","2":"ghi","3":"jkm","4":"nlo","5":"pqr","6":"stu"}'
node pub.js 6001 '{"0":"0a","1":"1b","2":"2c","3":"3d","4":"4e","5":"5f","6":"6g"}'
```
