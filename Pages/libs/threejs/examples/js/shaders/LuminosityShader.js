( function () {

	/**
	 * Luminosity Shader
	 * Calculates the luminosity of a texture
	 */

	const LuminosityShader = {
		shaderID: 'luminosity',
		uniforms: {
			'tDiffuse': {
				value: null
			}
		},
		vertexShader:
	/* glsl */
	`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
		fragmentShader:
	/* glsl */
	`

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			// Standard luminosity formula: 0.299*R + 0.587*G + 0.114*B
			float luminosity = dot( texel.xyz, vec3( 0.299, 0.587, 0.114 ) );

			gl_FragColor = vec4( vec3( luminosity ), texel.w );

		}`
	};

	THREE.LuminosityShader = LuminosityShader;

} )();