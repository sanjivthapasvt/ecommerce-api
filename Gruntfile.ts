import type * as gruntType from 'grunt';

const config = function (grunt: typeof gruntType): void {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  });

  grunt.registerTask('default', () => {
    grunt.log.writeln('✅ Grunt is working with TypeScript!');
  });
};

export default config;
